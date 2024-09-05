package com.evva.xesar.abrevva.plugins.capacitor

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.annotation.RequiresPermission
import com.evva.xesar.abrevva.ble.BleManager
import com.evva.xesar.abrevva.util.bytesToString
import com.evva.xesar.abrevva.util.stringToBytes
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Logger
import com.getcapacitor.PermissionState
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.PermissionCallback
import no.nordicsemi.android.kotlin.ble.core.scanner.BleScanResult
import java.util.UUID

@CapacitorPlugin(
    name = "AbrevvaPluginBLE",
    permissions = [
        com.getcapacitor.annotation.Permission(
            strings = [
                android.Manifest.permission.ACCESS_COARSE_LOCATION,
            ], alias = "ACCESS_COARSE_LOCATION"
        ),
        com.getcapacitor.annotation.Permission(
            strings = [
                android.Manifest.permission.ACCESS_FINE_LOCATION,
            ], alias = "ACCESS_FINE_LOCATION"
        ),
        com.getcapacitor.annotation.Permission(
            strings = [
                android.Manifest.permission.BLUETOOTH,
            ], alias = "BLUETOOTH"
        ),
        com.getcapacitor.annotation.Permission(
            strings = [
                android.Manifest.permission.BLUETOOTH_ADMIN,
            ], alias = "BLUETOOTH_ADMIN"
        ),
        com.getcapacitor.annotation.Permission(
            strings = [
                // Manifest.permission.BLUETOOTH_SCAN
                "android.permission.BLUETOOTH_SCAN",
            ], alias = "BLUETOOTH_SCAN"
        ),
        com.getcapacitor.annotation.Permission(
            strings = [
                // Manifest.permission.BLUETOOTH_ADMIN
                "android.permission.BLUETOOTH_CONNECT",
            ], alias = "BLUETOOTH_CONNECT"
        ),
    ]
)
class AbrevvaPluginBLE : Plugin() {
    companion object {
        private val tag = AbrevvaPluginBLE::class.simpleName
    }

    private lateinit var manager: BleManager
    private lateinit var aliases: Array<String>

    override fun load() {
        manager = BleManager(this.context)
        aliases = arrayOf()
    }

    @PluginMethod
    fun initialize(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val neverForLocation = call.getBoolean("androidNeverForLocation", false) as Boolean
            this.aliases = if (neverForLocation) {
                arrayOf(
                    "BLUETOOTH_SCAN",
                    "BLUETOOTH_CONNECT",
                )
            } else {
                arrayOf(
                    "BLUETOOTH_SCAN",
                    "BLUETOOTH_CONNECT",
                    "ACCESS_FINE_LOCATION",
                )
            }
        } else {
            this.aliases = arrayOf(
                "ACCESS_COARSE_LOCATION",
                "ACCESS_FINE_LOCATION",
                "BLUETOOTH",
                "BLUETOOTH_ADMIN",
            )
        }

        this.requestPermissionForAliases(this.aliases, call, "checkPermission")
    }

    @PermissionCallback
    private fun checkPermission(call: PluginCall) {
        val granted: List<Boolean> = this.aliases.map { alias ->
            this.getPermissionState(alias) == PermissionState.GRANTED
        }
        if (granted.all { it }) {
            this.runInitialization(call)
        } else {
            call.reject("checkPermission(): permission denied")
        }
    }

    private fun runInitialization(call: PluginCall) {
        if (!activity.packageManager.hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
            return call.reject("runInitialization(): BLE is not supported")
        }

        if (!manager.isBleEnabled()) {
            return call.reject("runInitialization(): BLE is not available")
        }

        call.resolve()
    }

    @PluginMethod
    fun isEnabled(call: PluginCall) {
        val result = JSObject()
        result.put("value", manager.isBleEnabled())

        call.resolve(result)
    }

    @PluginMethod
    fun isLocationEnabled(call: PluginCall) {
        val result = JSObject()
        result.put("value", manager.isLocationEnabled())

        call.resolve(result)
    }

    @PluginMethod
    fun startEnabledNotifications(call: PluginCall) {
        val success = manager.startBleEnabledNotifications { enabled ->
            val result = JSObject()
            result.put("value", enabled)

            try {
                notifyListeners("onEnabledChanged", result)
            } catch (e: Exception) {
                Logger.error(tag, "startEnabledNotifications()", e)
            }
        }

        if (!success) {
            call.reject("startEnabledNotifications(): Failed to set handler")
            return
        }

        call.resolve()
    }

    @PluginMethod
    fun stopEnabledNotifications(call: PluginCall) {
        manager.stopBleEnabledNotifications()

        call.resolve()
    }

    @PluginMethod
    fun openLocationSettings(call: PluginCall) {
        val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
        this.activity.startActivity(intent)

        call.resolve()
    }

    @PluginMethod
    fun openBluetoothSettings(call: PluginCall) {
        val intent = Intent(Settings.ACTION_BLUETOOTH_SETTINGS)
        this.activity.startActivity(intent)

        call.resolve()
    }

    @PluginMethod
    fun openAppSettings(call: PluginCall) {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
        intent.data = Uri.parse("package:" + activity.packageName)

        this.activity.startActivity(intent)

        call.resolve()
    }

    @PluginMethod
    fun requestLEScan(call: PluginCall) {
        val timeout = call.getFloat("timeout", 15000.0F)!!.toLong()

        this.manager.startScan({ success ->
            if (success) {
                call.resolve()
            } else {
                call.reject("requestLEScan(): failed to start")
            }
        }, { result ->
            Logger.debug(tag, "Found device: ${result.device.address}")

            val scanResult = getScanResultFromNordic(result)
            try {
                notifyListeners("onScanResult", scanResult)
            } catch (e: java.util.ConcurrentModificationException) {
                Logger.error(tag, "requestLEScan()", e)
            }
        }, { address ->
            try {
                notifyListeners("connected|${address}", null)
            } catch (e: java.util.ConcurrentModificationException) {
                Logger.error(tag, "onConnect()", e)
            }
        }, { address ->
            try {
                notifyListeners("disconnected|${address}", null)
            } catch (e: java.util.ConcurrentModificationException) {
                Logger.error(tag, "onDisconnect()", e)
            }
        },
            timeout
        )
    }

    @PluginMethod
    fun stopLEScan(call: PluginCall) {
        manager.stopScan()
        call.resolve()
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    fun connect(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!
        val timeout = call.getFloat("timeout", 16000.0F)!!.toLong()

        manager.connect(deviceId, { success ->
            if (success) {
                call.resolve()
            } else {
                call.reject("connect(): failed to connect after $timeout ms")
            }
        }, timeout)
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    fun disconnect(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!

        manager.disconnect(deviceId) { success ->
            if (success) {
                call.resolve()
            } else {
                call.reject("disconnect(): failed to disconnect")
            }
        }
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    fun read(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!
        val timeout = call.getFloat("timeout", 10000.0F)!!.toLong()
        val characteristic = getCharacteristic(call)
            ?: return call.reject("read(): bad characteristic")

        manager.read(deviceId, characteristic.first, characteristic.second, { success, data ->
            if (success) {
                val ret = JSObject()
                ret.put("value", bytesToString(data!!))
                call.resolve(ret)
            } else {
                call.reject("read(): failed to read from device")
            }
        }, timeout)
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    fun write(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!
        val timeout = call.getFloat("timeout", 10000.0F)!!.toLong()
        val characteristic =
            getCharacteristic(call) ?: return call.reject("read(): bad characteristic")
        val value =
            call.getString("value", null) ?: return call.reject("write(): missing value for write")

        manager.write(
            deviceId,
            characteristic.first,
            characteristic.second,
            stringToBytes(value),
            { success ->
                if (success) {
                    call.resolve()
                } else {
                    call.reject("write(): failed to write to device")
                }
            },
            timeout
        )
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    fun signalize(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!

        manager.signalize(deviceId) { success ->
            if (success) {
                call.resolve()
            } else {
                call.reject("signalize(): failed to signalize")
            }
        }
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    fun disengage(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!
        val mobileId = call.getString("mobileId", "")!!
        val mobileDeviceKey = call.getString("mobileDeviceKey", "")!!
        val mobileGroupId = call.getString("mobileGroupId", "")!!
        val mobileAccessData = call.getString("mobileAccessData", "")!!
        val isPermanentRelease = call.getBoolean("isPermanentRelease", false)!!

        manager.disengage(
            deviceId,
            mobileId,
            mobileDeviceKey,
            mobileGroupId,
            mobileAccessData,
            isPermanentRelease
        ) { status ->
            val result = JSObject()
            result.put("value", status)

            call.resolve(result)
        }
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    fun startNotifications(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!
        val characteristic =
            getCharacteristic(call)
                ?: return call.reject("startNotifications(): bad characteristic")

        manager.startNotifications(
            deviceId,
            characteristic.first,
            characteristic.second,
            { success ->
                if (success) {
                    call.resolve()
                } else {
                    call.reject("startNotifications(): failed to set notifications")
                }
            }, { data ->
                val key =
                    "notification|${deviceId}|${(characteristic.first)}|${(characteristic.second)}"

                val ret = JSObject()
                ret.put("value", bytesToString(data))

                try {
                    notifyListeners(key, ret)
                } catch (e: java.util.ConcurrentModificationException) {
                    Logger.error(tag, "startNotifications()", e)
                }
            })
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    fun stopNotifications(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!
        val characteristic =
            getCharacteristic(call)
                ?: return call.reject("stopNotifications(): bad characteristic")

        manager.stopNotifications(
            deviceId,
            characteristic.first,
            characteristic.second
        ) { success ->
            if (success) {
                call.resolve()
            } else {
                call.reject("stopNotifications(): failed to unset notifications")
            }
        }
    }

    private fun getCharacteristic(call: PluginCall): Pair<UUID, UUID>? {
        val serviceString = call.getString("service", null)
        val serviceUUID: UUID?

        try {
            serviceUUID = UUID.fromString(serviceString)
        } catch (e: IllegalArgumentException) {
            call.reject("getCharacteristic(): invalid service uuid")
            return null
        }

        if (serviceUUID == null) {
            call.reject("getCharacteristic(): service uuid required")
            return null
        }

        val characteristicString = call.getString("characteristic", null)
        val characteristicUUID: UUID?

        try {
            characteristicUUID = UUID.fromString(characteristicString)
        } catch (e: IllegalArgumentException) {
            call.reject("getCharacteristic(): invalid characteristic uuid")
            return null
        }

        if (characteristicUUID == null) {
            call.reject("getCharacteristic(): characteristic uuid required")
            return null
        }

        return Pair(serviceUUID, characteristicUUID)
    }

    private fun getBleDeviceFromNordic(result: BleScanResult): JSObject {
        val bleDevice = JSObject()

        bleDevice.put("deviceId", result.device.address)

        if (result.device.hasName) {
            bleDevice.put("name", result.device.name)
        }

        val uuids = JSArray()
        result.data?.scanRecord?.serviceUuids?.forEach { uuid -> uuids.put(uuid.toString()) }

        if (uuids.length() > 0) {
            bleDevice.put("uuids", uuids)
        }

        return bleDevice
    }

    @OptIn(ExperimentalStdlibApi::class)
    private fun getScanResultFromNordic(result: BleScanResult): JSObject {
        val scanResult = JSObject()
        val bleDevice = getBleDeviceFromNordic(result)

        scanResult.put("device", bleDevice)

        if (result.device.hasName) {
            scanResult.put("localName", result.device.name)
        }
        if (result.data?.rssi != null) {
            scanResult.put("rssi", result.data!!.rssi)
        }
        if (result.data?.txPower != null) {
            scanResult.put("txPower", result.data!!.txPower)
        } else {
            scanResult.put("txPower", 127)
        }

        val manufacturerData = JSObject()

        val scanRecordBytes = result.data?.scanRecord?.bytes
        if (scanRecordBytes != null) {
            try {
                // Extract EVVA manufacturer-id
                val keyHex = scanRecordBytes.getByte(6)?.toHexString() + scanRecordBytes.getByte(5)
                    ?.toHexString()
                val keyDec = keyHex.toInt(16)

                // Slice out manufacturer data
                val bytes = scanRecordBytes.copyOfRange(7, scanRecordBytes.size)

                manufacturerData.put(keyDec.toString(), bytesToString(bytes.value))
            } catch (e: Exception) {
                Logger.warn("getScanResultFromNordic(): invalid manufacturer data")
            }
        }

        scanResult.put("manufacturerData", manufacturerData)

        val serviceDataObject = JSObject()
        val serviceData = result.data?.scanRecord?.serviceData
        serviceData?.forEach {
            serviceDataObject.put(it.key.toString(), bytesToString(it.value.value))
        }
        scanResult.put("serviceData", serviceDataObject)

        val uuids = JSArray()
        result.data?.scanRecord?.serviceUuids?.forEach { uuid -> uuids.put(uuid.toString()) }
        scanResult.put("uuids", uuids)
        scanResult.put(
            "rawAdvertisement",
            result.data?.scanRecord?.bytes?.toString()
        )

        return scanResult
    }
}
