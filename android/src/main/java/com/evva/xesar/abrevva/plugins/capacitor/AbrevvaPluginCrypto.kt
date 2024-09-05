package com.evva.xesar.abrevva.plugins.capacitor

import com.evva.xesar.abrevva.crypto.AesCCM
import com.evva.xesar.abrevva.crypto.AesGCM
import com.evva.xesar.abrevva.crypto.HKDF
import com.evva.xesar.abrevva.crypto.SimpleSecureRandom
import com.evva.xesar.abrevva.crypto.X25519Wrapper
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.bouncycastle.util.encoders.Base64
import org.bouncycastle.util.encoders.Hex
import java.io.BufferedInputStream
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.nio.file.Paths

private enum class CryptoError {
    EncryptCryptoError,
    EncryptEmptyResultError,
    EncryptInvalidArgumentError,
    EncryptFileCryptoError,
    EncryptFileInvalidArgumentError,
    DecryptInvalidArgumentError,
    DecryptEmptyResultError,
    DecryptCryptoError,
    DecryptFileReadError,
    DecryptFileCryptoError,
    DecryptFileInvalidArgumentError,
    DecryptFileFromURLNetworkError,
    DecryptFileFromURLNotFoundError,
    DecryptFileFromURLInaccessibleError,
    DecryptFileFromURLNoResponseDataError,
    DecryptFileFromURLInvalidArgumentError,
    DecryptFileFromURLCryptoError,
    GenerateKeypairError,
    ComputeSharedSecretError,
    ComputeED25519PublicKeyError,
    SignCryptoError,
    VerifyCryptoError,
    VerifyFailedError,
    RandomError,
    DeriveInvalidArgumentError,
    DeriveEmptyResultError,
    DeriveCryptoError
}

@CapacitorPlugin(name = "AbrevvaPluginCrypto")
class AbrevvaPluginCrypto : Plugin() {
    @PluginMethod
    fun encrypt(call: PluginCall) {
        val key: ByteArray
        val iv: ByteArray
        val adata: ByteArray
        val pt: ByteArray
        try {
            key = Hex.decode(call.getString("key", ""))
            iv = Hex.decode(call.getString("iv", ""))
            adata = Hex.decode(call.getString("adata", ""))
            pt = Hex.decode(call.getString("pt", ""))
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.EncryptInvalidArgumentError.name,
                e
            )
        }

        val tagLength = call.getInt("tagLength", 0)

        val cipherText: String
        val authTag: String
        try {
            val ct: ByteArray = AesCCM.encrypt(key, iv, adata, pt, tagLength!!)
            val cipherTextData = ByteArray(pt.size)
            val authTagData = ByteArray(tagLength)

            System.arraycopy(ct, 0, cipherTextData, 0, pt.size)
            System.arraycopy(ct, pt.size, authTagData, 0, tagLength)

            if (ct.isEmpty()) {
                return call.reject(
                    AbrevvaPluginCrypto::class.simpleName,
                    CryptoError.EncryptEmptyResultError.name
                )
            }
            cipherText = Hex.toHexString(cipherTextData)
            authTag = Hex.toHexString(authTagData)
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.EncryptCryptoError.name,
                e
            )
        }
        val ret = JSObject()
        ret.put("cipherText", cipherText)
        ret.put("authTag", authTag)
        call.resolve(ret)
    }

    @PluginMethod
    fun encryptFile(call: PluginCall) {
        val sharedSecret: ByteArray
        try {
            sharedSecret = Hex.decode(call.getString("sharedSecret", ""))
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.EncryptFileInvalidArgumentError.name,
                e
            )
        }

        val ptPath = call.getString("ptPath", "")
        val ctPath = call.getString("ctPath", "")

        val success = AesGCM.encryptFile(Hex.decode(sharedSecret), ptPath!!, ctPath!!)
        if (!success) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.EncryptFileCryptoError.name
            )
        }
        call.resolve()
    }

    @PluginMethod
    fun decrypt(call: PluginCall) {
        val key: ByteArray
        val iv: ByteArray
        val adata: ByteArray
        val ct: ByteArray
        try {
            key = Hex.decode(call.getString("key", ""))
            iv = Hex.decode(call.getString("iv", ""))
            adata = Hex.decode(call.getString("adata", ""))
            ct = Hex.decode(call.getString("ct", ""))
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.DecryptInvalidArgumentError.name,
                e
            )
        }

        val tagLength = call.getInt("tagLength", 0)!!

        val pt: String
        try {
            val data: ByteArray = AesCCM.decrypt(key, iv, adata, ct, tagLength)
            if (data.isEmpty()) {
                return call.reject(
                    AbrevvaPluginCrypto::class.simpleName,
                    CryptoError.DecryptEmptyResultError.name
                )
            }
            pt = Hex.toHexString(data)
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.DecryptCryptoError.name
            )
        }
        val ret = JSObject()
        ret.put("plainText", pt)
        ret.put("authOk", true)
        call.resolve(ret)
    }

    @PluginMethod
    fun decryptFile(call: PluginCall) {
        val sharedSecret: ByteArray
        try {
            sharedSecret = Hex.decode(call.getString("sharedSecret", ""))
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.DecryptFileInvalidArgumentError.name,
                e
            )
        }

        val ctPath = call.getString("ctPath", "")!!
        val ptPath = call.getString("ptPath", "")!!

        val success = AesGCM.decryptFile(sharedSecret, ctPath, ptPath)
        if (!success) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.DecryptFileCryptoError.name
            )
        }
        call.resolve()
    }

    @PluginMethod
    fun decryptFileFromURL(call: PluginCall) {
        val sharedSecret: ByteArray
        try {
            sharedSecret = Hex.decode(call.getString("sharedSecret", ""))
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.DecryptFileFromURLInvalidArgumentError.name,
                e
            )
        }

        val uri = call.getString("url", "")!!
        val ptPath = call.getString("ptPath", "")!!
        val ctPath = Paths.get(ptPath).parent.toString() + "/blob"

        val file = File(ctPath)
        val url: URL
        val connection: HttpURLConnection
        val statusCode: Int

        try {
            url = URL(uri)
            connection = url.openConnection() as HttpURLConnection
            statusCode = connection.responseCode
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.DecryptFileFromURLNetworkError.name,
                e
            )
        }
        try {
            when (statusCode) {
                200 -> {
                    val inputStream = connection.inputStream
                    val bufferedInputStream = BufferedInputStream(inputStream)
                    val outputStream = FileOutputStream(file)
                    val dataBuffer = ByteArray(4096)
                    var bytesRead: Int

                    while (bufferedInputStream.read(dataBuffer, 0, 4096)
                            .also { bytesRead = it } != -1
                    ) {
                        outputStream.write(dataBuffer, 0, bytesRead)
                    }
                    outputStream.flush()
                    outputStream.close()
                }

                404 -> {
                    return call.reject(
                        AbrevvaPluginCrypto::class.simpleName,
                        CryptoError.DecryptFileFromURLNotFoundError.name
                    )
                }

                else -> {
                    return call.reject(
                        AbrevvaPluginCrypto::class.simpleName,
                        CryptoError.DecryptFileFromURLInaccessibleError.name
                    )
                }
            }
        } catch (e: IOException) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.DecryptFileFromURLNoResponseDataError.name,
                e
            )
        }

        val success = AesGCM.decryptFile(sharedSecret, ctPath, ptPath)
        if (!success) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.DecryptFileFromURLCryptoError.name
            )
        }
        call.resolve()
    }

    @PluginMethod
    fun generateKeyPair(call: PluginCall) {
        val keyPair: X25519Wrapper.KeyPair
        val privateKey: String
        val publicKey: String
        try {
            keyPair = X25519Wrapper.generateKeyPair()
            privateKey = Base64.toBase64String(keyPair.privateKey)
            publicKey = Base64.toBase64String(keyPair.publicKey)
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.GenerateKeypairError.name,
                e
            )
        }
        val ret = JSObject()
        ret.put("privateKey", privateKey)
        ret.put("publicKey", publicKey)
        call.resolve(ret)
    }

    @PluginMethod
    fun computeSharedSecret(call: PluginCall) {
        val privateKey = call.getString("privateKey", "")
        val peerPublicKey = call.getString("peerPublicKey", "")
        val sharedSecret: String
        try {
            val result = X25519Wrapper.computeSharedSecret(
                Base64.decode(privateKey),
                Base64.decode(peerPublicKey)
            )
            sharedSecret = Hex.toHexString(result)
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.ComputeSharedSecretError.name,
                e
            )
        }
        val ret = JSObject()
        ret.put("sharedSecret", sharedSecret)
        call.resolve(ret)
    }

    @PluginMethod
    fun computeED25519PublicKey(call: PluginCall) {
        val privateKey = call.getString("privateKey", "")
        val publicKey: String
        try {
            val result = X25519Wrapper.computeED25519PublicKey(Base64.decode(privateKey))
            publicKey = Base64.toBase64String(result)
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.ComputeED25519PublicKeyError.name,
                e
            )
        }
        val ret = JSObject()
        ret.put("publicKey", publicKey)
        call.resolve(ret)
    }

    @PluginMethod
    fun sign(call: PluginCall) {
        val privateKey = call.getString("privateKey", "")
        val data = call.getString("data", "")
        val signature: String
        try {
            val result = X25519Wrapper.sign(Base64.decode(privateKey), data!!.toByteArray())
            signature = Base64.toBase64String(result)
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.SignCryptoError.name,
                e
            )
        }
        val ret = JSObject()
        ret.put("signature", signature)
        call.resolve(ret)
    }

    @PluginMethod
    fun verify(call: PluginCall) {
        val publicKey = call.getString("publicKey", "")
        val data = call.getString("data", "")
        val success: Boolean
        try {
            val signature = Base64.decode(call.getString("signature", ""))
            success =
                X25519Wrapper.verify(Base64.decode(publicKey), data!!.toByteArray(), signature)
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.VerifyCryptoError.name,
                e
            )
        }
        if (!success) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.VerifyFailedError.name
            )
        }
        call.resolve()
    }

    @PluginMethod
    fun random(call: PluginCall) {
        val numBytes = call.getInt("numBytes", 0)
        val rnd: String
        try {
            val result = SimpleSecureRandom.getSecureRandomBytes(numBytes!!)
            rnd = Hex.toHexString(result)
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.RandomError.name,
                e
            )
        }
        val ret = JSObject()
        ret.put("value", rnd)
        call.resolve(ret)
    }

    @PluginMethod
    fun derive(call: PluginCall) {
        val key: ByteArray
        val salt: ByteArray
        val info: ByteArray
        try {
            key = Hex.decode(call.getString("key", ""))
            salt = Hex.decode(call.getString("salt", ""))
            info = Hex.decode(call.getString("info", ""))
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.DeriveInvalidArgumentError.name,
                e
            )
        }

        val length = call.getInt("length", 0)
        val derived: String
        try {
            val result: ByteArray = HKDF.derive(key, salt, info, length!!)
            if (result.isEmpty()) {
                return call.reject(
                    AbrevvaPluginCrypto::class.simpleName,
                    CryptoError.DeriveEmptyResultError.name
                )
            }
            derived = Hex.toHexString(result)
        } catch (e: Exception) {
            return call.reject(
                AbrevvaPluginCrypto::class.simpleName,
                CryptoError.DeriveCryptoError.name,
                e
            )
        }
        val ret = JSObject()
        ret.put("value", derived)
        call.resolve(ret)
    }
}
