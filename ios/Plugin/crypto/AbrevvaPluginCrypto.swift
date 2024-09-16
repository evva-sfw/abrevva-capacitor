import AbrevvaSDK
import Capacitor
import Foundation

private enum CryptoError: String {
    case EncryptCryptoError
    case EncryptEmptyResultError
    case EncryptInvalidArgumentError
    case EncryptFileCryptoError
    case EncryptFileInvalidArgumentError
    case DecryptInvalidArgumentError
    case DecryptEmptyResultError
    case DecryptCryptoError
    case DecryptFileReadError
    case DecryptFileCryptoError
    case DecryptFileInvalidArgumentError
    case DecryptFileFromURLNetworkError
    case DecryptFileFromURLNotFoundError
    case DecryptFileFromURLInaccessibleError
    case DecryptFileFromURLNoResponseDataError
    case DecryptFileFromURLInvalidArgumentError
    case DecryptFileFromURLCryptoError
    case GenerateKeypairError
    case ComputeSharedSecretError
    case ComputeED25519PublicKeyError
    case SignCryptoError
    case VerifyCryptoError
    case VerifyFailedError
    case RandomError
    case DeriveInvalidArgumentError
    case DeriveEmptyResultError
    case DeriveCryptoError
}

@objc(AbrevvaPluginCrypto)
public class AbrevvaPluginCrypto: CAPPlugin {
    private let X25519Impl = X25519()
    private let AesGcmImpl = AesGcm()
    private let AesCcmImpl = AesCcm()
    private let SimpleSecureRandomImpl = SimpleSecureRandom()
    private let HKDFImpl = HKDFWrapper()

    @objc
    func encrypt(_ call: CAPPluginCall) {
        let key = [UInt8](hex: "0x" + call.getString("key", ""))
        let iv = [UInt8](hex: "0x" + call.getString("iv", ""))
        let adata = [UInt8](hex: "0x" + call.getString("adata", ""))
        let pt = [UInt8](hex: "0x" + call.getString("pt", ""))
        let tagLength = call.getInt("tagLength", 0)

        let ct = self.AesCcmImpl.encrypt(key: key, iv: iv, adata: adata, pt: pt, tagLength: tagLength)
        if ct.isEmpty {
            return call.reject(AbrevvaPluginCrypto.description(), CryptoError.EncryptCryptoError.rawValue)
        }
        call.resolve([
            "cipherText": [UInt8](ct[..<pt.count]).toHexString(),
            "authTag": [UInt8](ct[pt.count...]).toHexString()
        ])
    }

    @objc
    func encryptFile(_ call: CAPPluginCall) {
        let sharedSecret = [UInt8](hex: "0x" + call.getString("sharedSecret", ""))
        let ptPath = call.getString("ptPath", "")
        let ctPath = call.getString("ctPath", "")

        let success = self.AesGcmImpl.encryptFile(key: sharedSecret, pathPt: ptPath, pathCt: ctPath)
        if !success {
            return call.reject(AbrevvaPluginCrypto.description(), CryptoError.EncryptFileCryptoError.rawValue)
        }
        call.resolve()
    }

    @objc
    func decrypt(_ call: CAPPluginCall) {
        let key = [UInt8](hex: "0x" + call.getString("key", ""))
        let iv = [UInt8](hex: "0x" + call.getString("iv", ""))
        let adata = [UInt8](hex: "0x" + call.getString("adata", ""))
        let ct = [UInt8](hex: "0x" + call.getString("ct", ""))
        let tagLength = call.getInt("tagLength", 0)

        let pt = self.AesCcmImpl.decrypt(key: key, iv: iv, adata: adata, ct: ct, tagLength: tagLength).toHexString()
        if pt.isEmpty {
            return call.reject(AbrevvaPluginCrypto.description(), CryptoError.DecryptEmptyResultError.rawValue)
        }
        call.resolve([
            "plainText": pt,
            "authOk": true
        ])
    }

    @objc
    func decryptFile(_ call: CAPPluginCall) {
        let sharedSecret = [UInt8](hex: "0x" + call.getString("sharedSecret", ""))
        let ctPath = call.getString("ctPath", "")
        let ptPath = call.getString("ptPath", "")

        let url = URL(fileURLWithPath: ctPath)
        let data: Data
        do {
            data = try Data(contentsOf: url, options: .mappedIfSafe)
        } catch {
            return call.reject(AbrevvaPluginCrypto.description(), CryptoError.DecryptFileReadError.rawValue, error)
        }
        let success = self.AesGcmImpl.decryptFile(key: sharedSecret, data: data, pathPt: ptPath)
        if !success {
            return call.reject(AbrevvaPluginCrypto.description(), CryptoError.DecryptFileCryptoError.rawValue)
        }
        call.resolve()
    }

    @objc
    func decryptFileFromURL(_ call: CAPPluginCall) {
        let sharedSecret = [UInt8](hex: "0x" + call.getString("sharedSecret", ""))
        let ptPath = call.getString("ptPath", "")
        let url = URL(string: call.getString("url", ""))

        let session = URLSession(configuration: URLSessionConfiguration.default)
        var request = URLRequest(url: url!)

        request.httpMethod = call.getString("verb", "GET")

        let task = session.dataTask(with: request) { data, response, error in
            if error != nil {
                return call.reject(
                    AbrevvaPluginCrypto.description(),
                    CryptoError.DecryptFileFromURLNetworkError.rawValue,
                    error
                )
            }
            if let response = response as? HTTPURLResponse {
                if response.statusCode == 200 {
                    let success = self.AesGcmImpl.decryptFile(key: sharedSecret, data: data!, pathPt: ptPath)
                    if !success {
                        return call.reject(
                            AbrevvaPluginCrypto.description(),
                            CryptoError.DecryptFileFromURLCryptoError.rawValue
                        )
                    }
                    call.resolve()
                } else if response.statusCode == 404 {
                    return call.reject(
                        AbrevvaPluginCrypto.description(),
                        CryptoError.DecryptFileFromURLNotFoundError.rawValue
                    )
                } else {
                    return call.reject(
                        AbrevvaPluginCrypto.description(),
                        CryptoError.DecryptFileFromURLInaccessibleError.rawValue
                    )
                }
            } else {
                return call.reject(
                    AbrevvaPluginCrypto.description(),
                    CryptoError.DecryptFileFromURLNoResponseDataError.rawValue
                )
            }
        }
        task.resume()
    }

    @objc
    func generateKeyPair(_ call: CAPPluginCall) {
        let keyPair = self.X25519Impl.generateKeyPair()

        call.resolve([
            "privateKey": keyPair[0].base64EncodedString(),
            "publicKey": keyPair[1].base64EncodedString()
        ])
    }

    @objc
    func computeSharedSecret(_ call: CAPPluginCall) {
        let privateKeyData = Data(base64Encoded: call.getString("privateKey", ""))
        let publicKeyData = Data(base64Encoded: call.getString("peerPublicKey", ""))

        if let sharedSecret = self.X25519Impl.computeSharedSecret(
            privateKeyData: privateKeyData!,
            publicKeyData: publicKeyData!
        ) {
            return call.resolve(["sharedSecret": sharedSecret.toHexString()])
        }
        call.reject(AbrevvaPluginCrypto.description(), CryptoError.ComputeSharedSecretError.rawValue)
    }

    @objc
    func computeED25519PublicKey(_ call: CAPPluginCall) {
        let privateKeyData = Data(base64Encoded: call.getString("privateKey", ""))

        if let publicKey = self.X25519Impl.computeED25519PublicKey(privateKeyData: privateKeyData!) {
            return call.resolve(["publicKey": publicKey.base64EncodedString()])
        }
        call.reject(AbrevvaPluginCrypto.description(), CryptoError.ComputeED25519PublicKeyError.rawValue)
    }

    @objc
    func sign(_ call: CAPPluginCall) {
        let privateKeyData = Data(base64Encoded: call.getString("privateKey", ""))
        let data = call.getString("data", "").data(using: .utf8)

        if let signature = self.X25519Impl.sign(privateKeyData: privateKeyData!, data: data!) {
            return call.resolve(["signature": signature.base64EncodedString()])
        }
        call.reject(AbrevvaPluginCrypto.description(), CryptoError.SignCryptoError.rawValue)
    }

    @objc
    func verify(_ call: CAPPluginCall) {
        let publicKeyData = Data(base64Encoded: call.getString("publicKey", ""))
        let data = call.getString("data", "").data(using: .utf8)
        let signature = Data(base64Encoded: call.getString("signature", ""))

        let success = self.X25519Impl.verify(publicKeyData: publicKeyData!, data: data!, signature: signature!)
        if !success {
            return call.reject(AbrevvaPluginCrypto.description(), CryptoError.VerifyFailedError.rawValue)
        }
        call.resolve()
    }

    @objc
    func random(_ call: CAPPluginCall) {
        let numBytes = call.getInt("numBytes", 0)

        let rnd = self.SimpleSecureRandomImpl.random(numBytes).toHexString()
        if rnd.isEmpty {
            return call.reject(AbrevvaPluginCrypto.description(), CryptoError.RandomError.rawValue)
        }
        call.resolve(["value": rnd])
    }

    @objc
    func derive(_ call: CAPPluginCall) {
        let key = [UInt8](hex: "0x" + call.getString("key", ""))
        let salt = [UInt8](hex: "0x" + call.getString("salt", ""))
        let info = [UInt8](hex: "0x" + call.getString("info", ""))
        let length = call.getInt("length", 0)

        let derived = self.HKDFImpl.derive(key: key, salt: salt, info: info, length: length).toHexString()
        if derived.isEmpty {
            return call.reject(AbrevvaPluginCrypto.description(), CryptoError.DeriveEmptyResultError.rawValue)
        }
        call.resolve(["value": derived])
    }
}
