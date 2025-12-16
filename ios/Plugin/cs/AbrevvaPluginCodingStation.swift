import Capacitor
import Foundation
import AbrevvaSDK

@objc(AbrevvaPluginCodingStation)
public class AbrevvaPluginCodingStation: CAPPlugin {

    private var connectionOptions: MqttConnectionOptions?
    private let cs = CodingStation()

    @objc
    func register(_ call: CAPPluginCall) {
        let url = call.getString("url")
        let clientId = call.getString("clientId")
        let username = call.getString("username")
        let password = call.getString("password")

        if let _url = url, let _clientId = clientId, let _username = username, let _password = password {
            Task {
                do {
                    connectionOptions = try await AuthManager.getMqttConfigForXS(url: URL(string: _url)!, clientId: _clientId, username: _username, password: _password)
                    call.resolve()
                } catch {
                    return call.reject("register(): failed to authenticate: \(error)")
                }
            }
        } else {
            call.reject("register(): invalid params")
        }
    }

    @objc
    func connect(_ call: CAPPluginCall) {
        if let connectionOptions = connectionOptions {
            Task {
                do {
                    try await cs.connect(connectionOptions)
                    call.resolve()
                } catch {
                    call.reject("connect(): failed to connect: \(error)")
                }
            }
        } else {
            call.reject("connect(): not authenticated")
        }
    }

    @objc
    func disconnect(_ call: CAPPluginCall) {
        cs.disconnect()
        call.resolve()
    }

    @objc
    func write(_ call: CAPPluginCall) {
        Task {
            do {
                try await cs.write()
                call.resolve()
            } catch {
                call.reject("write(): failed to write: \(error)")
            }
        }
    }
}
