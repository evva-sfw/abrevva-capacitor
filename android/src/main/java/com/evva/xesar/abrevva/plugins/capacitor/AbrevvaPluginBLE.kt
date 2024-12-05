package com.evva.xesar.abrevva.plugins.capacitor

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.annotation.RequiresPermission
import com.evva.xesar.abrevva.ble.BleDevice
import com.evva.xesar.abrevva.ble.BleManager
import com.evva.xesar.abrevva.ble.BleWriteType
import com.evva.xesar.abrevva.util.bytesToString
import com.evva.xesar.abrevva.util.stringToBytes
import com.getcapacitor.JSObject
import com.getcapacitor.Logger
import com.getcapacitor.PermissionState
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.PermissionCallback
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
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
        val macFilter = call.getString("macFilter", null)
        val timeout = call.getFloat("timeout", 15000.0F)!!.toLong()

        this.manager.startScan({ device ->
            Logger.debug(tag, "Found device: ${device.address}")

            val bleDevice = getBleDeviceData(device)
            try {
                notifyListeners("onScanResult", bleDevice)
            } catch (e: Exception) {
                Logger.error(tag, "requestLEScan()", e)
            }
        }, { success ->
            if (success) {
                call.resolve()
            } else {
                call.reject("requestLEScan(): failed to start")
            }
        }, {}, macFilter, timeout)
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
        val device = manager.getBleDevice(deviceId) ?: run {
            return call.reject("connect(): device not found")
        }

        manager.connect(device, { success ->
            if (success) {
                try {
                    notifyListeners("connected|${deviceId}", null)
                } catch (e: java.util.ConcurrentModificationException) {
                    Logger.error(tag, "onConnect()", e)
                }
                call.resolve()
            } else {
                call.reject("connect(): failed to connect after $timeout ms")
            }
        }, {
            try {
                notifyListeners("disconnected|${deviceId}", null)
            } catch (e: java.util.ConcurrentModificationException) {
                Logger.error(tag, "onConnect()", e)
            }
        }, timeout)
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    fun disconnect(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!
        val device = manager.getBleDevice(deviceId) ?: run {
            return call.reject("disconnect(): device not found")
        }

        manager.disconnect(device) { success ->
            if (success) {
                try {
                    notifyListeners("disconnected|${deviceId}", null)
                } catch (e: java.util.ConcurrentModificationException) {
                    Logger.error(tag, "onDisconnect()", e)
                }
                call.resolve()
            } else {
                call.reject("disconnect(): failed to disconnect")
            }
        }
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    @OptIn(DelicateCoroutinesApi::class)
    fun read(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!
        val timeout = call.getFloat("timeout", 10000.0F)!!.toLong()
        val characteristic = getCharacteristic(call) ?: run {
            return call.reject("read(): bad characteristic")
        }
        val device = manager.getBleDevice(deviceId) ?: run {
            return call.reject("read(): device not found")
        }

        GlobalScope.launch {
            val data = device.read(characteristic.first, characteristic.second, timeout)
            if (data != null) {
                val ret = JSObject()
                ret.put("value", bytesToString(data))
                call.resolve(ret)
            } else {
                call.reject("read(): failed to read from device")
            }
        }
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    @OptIn(DelicateCoroutinesApi::class)
    fun write(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!
        val timeout = call.getFloat("timeout", 10000.0F)!!.toLong()
        val characteristic = getCharacteristic(call) ?: run {
            return call.reject("write(): bad characteristic")
        }
        val value = call.getString("value", null) ?: run {
            return call.reject("write(): missing value for write")
        }
        val device = manager.getBleDevice(deviceId) ?: run {
            return call.reject("write(): device not found")
        }

        GlobalScope.launch {
            val success = device.write(
                characteristic.first,
                characteristic.second,
                stringToBytes(value),
                BleWriteType.NO_RESPONSE,
                timeout
            )
            if (success) {
                call.resolve()
            } else {
                call.reject("write(): failed to write to device")
            }
        }
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    fun signalize(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!
        val device = manager.getBleDevice(deviceId) ?: run {
            return call.reject("signalize(): device not found")
        }

        manager.signalize(device) { success ->
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
        val mediumAccessData = call.getString("mediumAccessData", "")!!
        val isPermanentRelease = call.getBoolean("isPermanentRelease", false)!!
        val device = manager.getBleDevice(deviceId) ?: run {
            return call.reject("disengage(): device not found")
        }

        manager.disengage(
            device,
            mobileId,
            mobileDeviceKey,
            mobileGroupId,
            mediumAccessData,
            isPermanentRelease
        ) { status ->
            val result = JSObject()
            result.put("value", status)

            call.resolve(result)
        }
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    @OptIn(DelicateCoroutinesApi::class)
    fun startNotifications(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!
        val characteristic = getCharacteristic(call) ?: run {
            return call.reject("startNotifications(): bad characteristic")
        }
        val device = manager.getBleDevice(deviceId) ?: run {
            return call.reject("startNotifications(): device not found")
        }

        GlobalScope.launch {
            val success = device.setNotifications(characteristic.first,
                characteristic.second, { data ->
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
            if (success) {
                call.resolve()
            } else {
                call.reject("startNotifications(): failed to set notifications")
            }
        }
    }

    @PluginMethod
    @RequiresPermission(value = "android.permission.BLUETOOTH_CONNECT")
    @OptIn(DelicateCoroutinesApi::class)
    fun stopNotifications(call: PluginCall) {
        val deviceId = call.getString("deviceId", "")!!
        val characteristic = getCharacteristic(call) ?: run {
            return call.reject("stopNotifications(): bad characteristic")
        }
        val device = manager.getBleDevice(deviceId) ?: run {
            return call.reject("stopNotifications(): device not found")
        }

        GlobalScope.launch {
            val success = device.stopNotifications(characteristic.first, characteristic.second)
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

    private fun getBleDeviceData(device: BleDevice): JSObject {
        val bleDeviceData = JSObject()

        bleDeviceData.put("deviceId", device.address)
        bleDeviceData.put("name", device.localName)

        val advertisementData = JSObject()
        device.advertisementData?.let {
            advertisementData.put("rssi", it.rssi)
            advertisementData.put("isConnectable", it.isConnectable)

            val manufacturerData = JSObject()
            it.manufacturerData?.let { data ->
                manufacturerData.put("companyIdentifier", data.companyIdentifier.toInt())
                manufacturerData.put("version", data.version.toInt())
                manufacturerData.put(
                    "componentType",
                    when (data.componentType.toInt()) {
                        98 -> "escutcheon"
                        100 -> "handle"
                        105 -> "iobox"
                        109 -> "emzy"
                        119 -> "wallreader"
                        122 -> "cylinder"
                        else -> "unknown"
                    }
                )
                manufacturerData.put(
                    "mainFirmwareVersionMajor",
                    data.mainFirmwareVersionMajor.toInt()
                )
                manufacturerData.put(
                    "mainFirmwareVersionMinor",
                    data.mainFirmwareVersionMinor.toInt()
                )
                manufacturerData.put(
                    "mainFirmwareVersionPatch",
                    data.mainFirmwareVersionPatch.toInt()
                )
                manufacturerData.put("componentHAL", data.componentHAL)
                manufacturerData.put(
                    "batteryStatus",
                    if (data.batteryStatus) "battery-full" else "battery-empty"
                )
                manufacturerData.put("mainConstructionMode", data.mainConstructionMode)
                manufacturerData.put("subConstructionMode", data.subConstructionMode)
                manufacturerData.put("isOnline", data.isOnline)
                manufacturerData.put("officeModeEnabled", data.officeModeEnabled)
                manufacturerData.put("twoFactorRequired", data.twoFactorRequired)
                manufacturerData.put("officeModeActive", data.officeModeActive)
                manufacturerData.put("reservedBits", data.reservedBits)
                manufacturerData.put("identifier", data.identifier)
                manufacturerData.put(
                    "subFirmwareVersionMajor",
                    data.subFirmwareVersionMajor?.toInt()
                )
                manufacturerData.put(
                    "subFirmwareVersionMinor",
                    data.subFirmwareVersionMinor?.toInt()
                )
                manufacturerData.put(
                    "subFirmwareVersionPatch",
                    data.subFirmwareVersionPatch?.toInt()
                )
                manufacturerData.put("subComponentIdentifier", data.subComponentIdentifier)
            }
            bleDeviceData.put("manufacturerData", manufacturerData)
        }
        bleDeviceData.put("advertisementData", advertisementData)

        return bleDeviceData
    }
}
