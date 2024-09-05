package com.evva.xesar.abrevva.plugins.capacitor

import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import android.Manifest
import android.content.Intent
import android.nfc.NfcAdapter
import com.evva.xesar.abrevva.nfc.KeyStoreHandler
import com.evva.xesar.abrevva.nfc.Message
import com.evva.xesar.abrevva.nfc.Mqtt5Client
import com.evva.xesar.abrevva.nfc.NfcDelegate
import com.evva.xesar.abrevva.nfc.asByteArray
import com.hivemq.client.mqtt.mqtt5.message.publish.Mqtt5Publish
import java.util.Timer
import java.util.TimerTask

@CapacitorPlugin(name = "AbrevvaPluginNFC",
    permissions = [
        Permission(strings = [ Manifest.permission.NFC ], alias = "NFC")
    ]
)
class AbrevvaPluginNFC : Plugin() {
    companion object {
        private val TAG = AbrevvaPluginNFC::class.simpleName
    }

    private val host = "172.16.2.91"
    private val port = 1883
    private val clientID = "96380897-0eee-479e-80c3-84c0dde286cd"

    private val STATUS_NFC_OK = "enabled"
    private val DIRECTORY_DOCUMENTS = "/storage/emulated/0/Documents/"

    private val kyOffTimer = Timer()
    private val hbTimer = Timer()

    private var mqtt5Client: Mqtt5Client? = null
    private var nfcDelegate = NfcDelegate()

    private var clientId: String? = null

    private val adapterStatus: String
        get() = nfcDelegate.setAdapterStatus()

    override fun handleOnStart() {
        super.handleOnStart()
        nfcDelegate.setAdapter(NfcAdapter.getDefaultAdapter(context))

    }

    override fun handleOnResume() {
        super.handleOnResume()
        nfcDelegate.restartForegroundDispatch(context, activity)
    }

    override fun handleOnPause() {
        super.handleOnPause()
        nfcDelegate.disableForegroundDispatch(context, activity)
    }

    override fun handleOnStop() {
        super.handleOnStop()
    }

    override fun handleOnNewIntent(intent: Intent?) {
        super.handleOnNewIntent(intent)

        if (intent != null) {
            this.bridge.activity.intent = intent
            nfcDelegate.processTag(intent) {
                mqtt5Client?.subscribe("readers/1/$clientId/t", this::messageReceivedCallback)
                mqtt5Client?.publish("readers/1/$clientId", Message("ky", "on", nfcDelegate.getIdentifier(), nfcDelegate.getHistoricalBytesAsHexString(), "BAKA").asByteArray())
                setDisconnectTimer()
                setHbTimer()
            }
        }
    }

    private fun messageReceivedCallback(response: Mqtt5Publish) {
        try {
            val resp = nfcDelegate.transceive(response.payloadAsBytes)
            mqtt5Client?.publish("readers/1/$clientId/f", resp)
        } catch (e: Exception){
            println(e)
        }
    }

    private fun setDisconnectTimer() {
        kyOffTimer.scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                try {
                    // .isConnected throws SecurityException when Tag is outdated
                    nfcDelegate.isConnected()
                } catch (ex: java.lang.Exception) {
                    mqtt5Client?.publish("readers/1",Message("ky", "off", oid = clientId).asByteArray())
                    this.cancel()
                }
            }
        }, 250, 250)
    }

    private fun setHbTimer(){
        hbTimer.scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
               mqtt5Client?.publish("readers/1", Message("cr", "hb", oid = clientId).asByteArray())
            }
        }, 30000, 30000)
    }



    @PluginMethod
    fun read(call: PluginCall) {
        if (adapterStatus != STATUS_NFC_OK) {
            // No NFC hardware or NFC is disabled by the user
            call.reject(adapterStatus)
            return
        }
        nfcDelegate.restartForegroundDispatch(context, activity)
    }

    @OptIn(ExperimentalStdlibApi::class)
    @PluginMethod
    fun connect() {
        val ksh = KeyStoreHandler()
        try {
            ksh.parseP12File("$DIRECTORY_DOCUMENTS/client-android.p12", "123")
            ksh.initKeyManagerFactory()
            ksh.initTrustManagerFactory()
        }
        catch (ex: Exception) {
            println(ex)
            return
        }

        this.clientId = clientID
        this.mqtt5Client = Mqtt5Client(clientID, port, host, ksh)
        mqtt5Client?.connect()
        print(Message("ky", "off", oid = "oidValue").asByteArray().toHexString())
    }

    @PluginMethod
    fun disconnect() {
        hbTimer.cancel()
        kyOffTimer.cancel()
        mqtt5Client?.publish("readers/1",Message("cr", "off", oid = clientID).asByteArray())
        mqtt5Client?.disconnect()
    }

}
