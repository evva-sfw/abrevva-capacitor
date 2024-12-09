import AbrevvaSDK
import Capacitor
import CoreBluetooth
import Foundation

@objc(AbrevvaPluginBLE)
public class AbrevvaPluginBLE: CAPPlugin {

    private var bleManager: BleManager?
    private var bleDeviceMap = [String: BleDevice]()

    @objc
    func initialize(_ call: CAPPluginCall) {
        self.bleManager = BleManager { success, message in
            if success {
                call.resolve()
            } else {
                call.reject(message!)
            }
        }
    }

    @objc
    func isEnabled(_ call: CAPPluginCall) {
        guard let bleManager = self.getBleManager(call) else { return }
        let enabled: Bool = bleManager.isBleEnabled()
        call.resolve(["value": enabled])
    }

    @objc
    func isLocationEnabled(_ call: CAPPluginCall) {
        call.unavailable("isLocationEnabled(): not available on iOS")
    }

    @objc
    func startEnabledNotifications(_ call: CAPPluginCall) {
        guard let bleManager = self.getBleManager(call) else { return }
        bleManager.registerStateReceiver { enabled in
            self.notifyListeners("onEnabledChanged", data: ["value": enabled])
        }
        call.resolve()
    }

    @objc
    func stopEnabledNotifications(_ call: CAPPluginCall) {
        guard let bleManager = self.getBleManager(call) else { return }
        bleManager.unregisterStateReceiver()
        call.resolve()
    }

    @objc
    func openLocationSettings(_ call: CAPPluginCall) {
        call.unavailable("openLocationSettings(): is not available on iOS")
    }

    @objc
    func openBluetoothSettings(_ call: CAPPluginCall) {
        call.unavailable("openBluetoothSettings(): is not available on iOS")
    }

    @objc
    func openAppSettings(_ call: CAPPluginCall) {
        guard let settingsURL = URL(string: UIApplication.openSettingsURLString) else {
            call.reject("openAppSettings(): cannot open app settings")
            return
        }

        DispatchQueue.main.async {
            if UIApplication.shared.canOpenURL(settingsURL) {
                UIApplication.shared.open(settingsURL, completionHandler: { success in
                    call.resolve([
                        "value": success
                    ])
                })
            } else {
                call.reject("openAppSettings(): cannot open app settings")
            }
        }
    }

    @objc
    func requestLEScan(_ call: CAPPluginCall) {
        guard let bleManager = self.getBleManager(call) else { return }
        let macFilter = call.getString("macFilter")
        let timeout = call.getDouble("timeout").map { Int($0) } ?? nil

      bleManager.startScan(
        { device, advertisementData, rssi in
          self.bleDeviceMap[device.getAddress()] = device
          let data = self.getAdvertismentData(device, rssi)
          debugPrint(data)
          self.notifyListeners("onScanResult", data: data)
        },
        { error in
          if error == nil {
            call.resolve()
          } else {
            call.reject("requestLEScan(): failed to start")
          }
        },
        { error in },
        macFilter,
        false,
        timeout
      )
    }

    @objc
    func stopLEScan(_ call: CAPPluginCall) {
        guard let bleManager = self.getBleManager(call) else { return }
        bleManager.stopScan()
        call.resolve()
    }

    @objc
    func connect(_ call: CAPPluginCall) {
        guard self.getBleManager(call) != nil else { return }
        guard let device = self.getDevice(call, checkConnection: false) else { return }
        let timeout = call.getDouble("timeout").map { Int($0) } ?? nil
        Task {
          let success = await self.bleManager!.connect(device, { address in
            self.notifyListeners("disconnected|\(address)", data: nil)
          },
           timeout)
          
            if success {
                call.resolve()
            } else {
                call.reject("connect(): failed to connect to device")
            }
        }
    }

    @objc
    func disconnect(_ call: CAPPluginCall) {
        guard self.getBleManager(call) != nil else { return }
        guard let device = self.getDevice(call, checkConnection: false) else { return }

        Task {
            let success = await self.bleManager!.disconnect(device)
            if success {
                call.resolve()
            } else {
                call.reject("disconnect(): failed to disconnect from device")
            }
        }
    }

    @objc
    func read(_ call: CAPPluginCall) {
        guard self.getBleManager(call) != nil else { return }
        guard let device = self.getDevice(call) else { return }
        guard let characteristic = self.getCharacteristic(call) else { return }
        let timeout = call.getDouble("timeout").map { Int($0) } ?? nil

        Task {
            let data = await device.read(characteristic.0, characteristic.1, timeout)
            if data != nil {
                call.resolve(["value": dataToString(data!)])
            } else {
                call.reject("read(): failed to read data")
            }
        }
    }

    @objc
    func write(_ call: CAPPluginCall) {
        guard self.getBleManager(call) != nil else { return }
        guard let device = self.getDevice(call) else { return }
        guard let characteristic = self.getCharacteristic(call) else { return }
        guard let value = call.getString("value") else {
            call.reject("write(): value must be provided")
            return
        }
        let writeType = CBCharacteristicWriteType.withoutResponse
        let timeout = call.getDouble("timeout").map { Int($0) } ?? nil

        Task {
            let success = await device.write(
                characteristic.0,
                characteristic.1,
                stringToData(value),
                writeType,
                timeout
            )
            if success {
                call.resolve()
            } else {
                call.reject("write(): failed to write data")
            }
        }
    }

    @objc
    func signalize(_ call: CAPPluginCall) {
        guard self.getBleManager(call) != nil else { return }
        guard let device = self.getDevice(call, checkConnection: false) else { return }

        Task {
            let success = await self.bleManager!.signalize(device)
            if success {
                call.resolve()
            } else {
                call.reject("signalize(): error signalizing")
            }
        }
    }

    @objc
    func disengage(_ call: CAPPluginCall) {
        guard self.getBleManager(call) != nil else { return }
        guard let device = self.getDevice(call, checkConnection: false) else { return }
        let mobileID = call.getString("mobileId") ?? ""
        let mobileDeviceKey = call.getString("mobileDeviceKey") ?? ""
        let mobileGroupID = call.getString("mobileGroupId") ?? ""
        let mediumAccessData = call.getString("mediumAccessData") ?? ""
        let isPermanentRelease = call.getBool("isPermanentRelease") ?? false
        let timeout = call.getDouble("timeout").map { Int($0) } ?? nil

        Task {
            let status = await self.bleManager!.disengage(
                device,
                mobileID,
                mobileDeviceKey,
                mobileGroupID,
                mediumAccessData,
                isPermanentRelease,
                timeout
            )
            call.resolve(["value": status.rawValue])
        }
    }

    @objc
    func startNotifications(_ call: CAPPluginCall) {
        guard self.getBleManager(call) != nil else { return }
        guard let device = self.getDevice(call) else { return }
        guard let characteristic = self.getCharacteristic(call) else { return }
        let timeout = call.getDouble("timeout").map { Int($0) } ?? nil

        Task {
            let success = await device.setNotifications(characteristic.0, characteristic.1, true, { value in
                let key =
                    "notification|\(device.getAddress())|" +
                    "\(characteristic.0.uuidString.lowercased())|" +
                    "\(characteristic.1.uuidString.lowercased())"

                if value != nil {
                    self.notifyListeners(key, data: ["value": dataToString(value!)])
                } else {
                    self.notifyListeners(key, data: nil)
                }
            }, timeout)
            if success {
                call.resolve()
            } else {
                call.reject("startNotifications(): failed to start notifications")
            }
        }
    }

    @objc
    func stopNotifications(_ call: CAPPluginCall) {
        guard self.getBleManager(call) != nil else { return }
        guard let device = self.getDevice(call) else { return }
        guard let characteristic = self.getCharacteristic(call) else { return }
        let timeout = call.getDouble("timeout").map { Int($0) } ?? nil

        Task {
            let success = await device.setNotifications(characteristic.0, characteristic.1, false, nil, timeout)
            if success {
                call.resolve()
            } else {
                call.reject("stopNotifications(): failed to stop notifications")
            }
        }
    }

    private func getBleManager(_ call: CAPPluginCall) -> BleManager? {
        guard let bleManager = self.bleManager else {
            call.reject("getBleManager(): not initialized")
            return nil
        }
        return bleManager
    }

    private func getServiceUUIDs(_ call: CAPPluginCall) -> [CBUUID] {
        let services = call.getArray("services", String.self) ?? []
        let serviceUUIDs = services.map { service -> CBUUID in
            return CBUUID(string: service)
        }
        return serviceUUIDs
    }

    private func getDevice(_ call: CAPPluginCall, checkConnection: Bool = true) -> BleDevice? {
        guard let deviceID = call.getString("deviceId") else {
            call.reject("getDevice(): deviceId required")
            return nil
        }
        guard let device = self.bleDeviceMap[deviceID] else {
            call.reject("getDevice(): device not found")
            return nil
        }
        if checkConnection {
            guard device.isConnected() else {
                call.reject("getDevice(): not connected to device")
                return nil
            }
        }
        return device
    }

    private func getCharacteristic(_ call: CAPPluginCall) -> (CBUUID, CBUUID)? {
        guard let service = call.getString("service") else {
            call.reject("getCharacteristic(): service UUID required")
            return nil
        }
        let serviceUUID = CBUUID(string: service)

        guard let characteristic = call.getString("characteristic") else {
            call.reject("getCharacteristic(): characteristic UUID required")
            return nil
        }
        let characteristicUUID = CBUUID(string: characteristic)
        return (serviceUUID, characteristicUUID)
    }

    private func getAdvertismentData(
        _ device: BleDevice,
        _ rssi: NSNumber
    ) -> [String: Any] {
      
      var bleDeviceData: [String: Any] = [
        "deviceId": device.getAddress(),
        "name": device.getName()
      ]
      
      var advertismentData: [String: Any] = [
        "rssi": rssi
      ]
      if let isConnectable = device.advertisementData?.isConnectable {
        advertismentData["isConnectable"] = isConnectable
      }
      
      guard let mfData = device.advertisementData?.manufacturerData else {
        bleDeviceData ["advertisementData"] = advertismentData
        return bleDeviceData
      }
      
      var manufacturerData: [String: Any] = [
        "companyIdentifier": mfData.companyIdentifier,
        "version": mfData.version,
        "mainFirmwareVersionMajor": mfData.mainFirmwareVersionMajor,
        "mainFirmwareVersionMinor": mfData.mainFirmwareVersionMinor,
        "mainFirmwareVersionPatch": mfData.mainFirmwareVersionPatch,
        "componentHAL": mfData.componentHAL,
        "batteryStatus": mfData.batteryStatus ? "battery-full" : "battery-empty",
        "mainConstructionMode": mfData.mainConstructionMode,
        "subConstructionMode": mfData.subConstructionMode,
        "isOnline": mfData.isOnline,
        "officeModeEnabled": mfData.officeModeEnabled,
        "twoFactorRequired": mfData.twoFactorRequired,
        "officeModeActive": mfData.officeModeActive,
        "identifier": mfData.identifier,
        "subFirmwareVersionMajor": mfData.subFirmwareVersionMajor,
        "subFirmwareVersionMinor": mfData.subFirmwareVersionMinor,
        "subFirmwareVersionPatch": mfData.subFirmwareVersionPatch,
        "subComponentIdentifier": mfData.subComponentIdentifier,
        "componentType": getComponentType(mfData.componentType)
      ]
      manufacturerData = manufacturerData.filter({$0.value != nil})
      advertismentData["manufacturerData"] = manufacturerData
      bleDeviceData["advertisementData"] = advertismentData
      
      return bleDeviceData
    }

  
  private func getComponentType(_ componentType: UInt8) -> String {
    switch componentType {
    case 98:
      "escutcheon"
    case 100:
      "handle"
    case 105:
      "iobox"
    case 109:
      "emzy"
    case 119:
      "wallreader"
    case 122:
      "cylinder"
    default:
      "unkown"
    }
  }
}
