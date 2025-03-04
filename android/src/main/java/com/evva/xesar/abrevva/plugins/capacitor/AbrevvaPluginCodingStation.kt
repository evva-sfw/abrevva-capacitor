package com.evva.xesar.abrevva.plugins.capacitor

import android.Manifest
import android.content.Intent
import com.evva.xesar.abrevva.auth.AuthManager
import com.evva.xesar.abrevva.cs.CodingStation
import com.evva.xesar.abrevva.mqtt.MqttConnectionOptions
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import java.net.URL

@CapacitorPlugin(
    name = "AbrevvaPluginCodingStation", permissions = [
        Permission(strings = [Manifest.permission.NFC], alias = "NFC"),
    ]
)
class AbrevvaPluginCodingStation : Plugin() {

    private var connectionOptions: MqttConnectionOptions? = null
    private lateinit var cs: CodingStation

    override fun load() {
        super.load()
        cs = CodingStation(context)
    }

    @PluginMethod
    fun register(call: PluginCall) {
        val url = call.getString("url")
        val clientId = call.getString("clientId")
        val username = call.getString("username")
        val password = call.getString("password")

        if (url == null || clientId == null || username == null || password == null) {
            return call.reject("register(): invalid params")
        }
        try {
            connectionOptions = AuthManager.getMqttConfigForXS(URL(url), clientId, username, password)
            call.resolve()
        } catch (e: Exception) {
            call.reject("register(): failed to authenticate: $e")
        }
    }

    @PluginMethod
    @OptIn(DelicateCoroutinesApi::class)
    fun connect(call: PluginCall) {
        GlobalScope.launch {
            connectionOptions?.let {
                try {
                    cs.connect(it)
                    call.resolve()
                } catch (e: Exception) {
                    call.reject("connect(): failed to connect: $e")
                }
            } ?: run {
                call.reject("connect(): not authenticated")
            }
        }
    }

    @PluginMethod
    fun disconnect(call: PluginCall) {
        cs.disconnect()
        call.resolve()
    }

    @PluginMethod
    @OptIn(DelicateCoroutinesApi::class)
    fun write(call: PluginCall) {
        GlobalScope.launch {
            try {
                val success = cs.startTagReader(activity, 10000L)
                if (success) call.resolve()
                else call.reject("write(): write cancelled")
            } catch (e: Exception) {
                call.reject("write(): failed to write: $e")
            }
        }
    }

    override fun handleOnNewIntent(intent: Intent?) {
        super.handleOnNewIntent(intent).also { cs.onHandleIntent(intent) }
    }
}
