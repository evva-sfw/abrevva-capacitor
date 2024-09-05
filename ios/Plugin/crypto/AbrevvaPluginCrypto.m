#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(AbrevvaPluginCrypto, "AbrevvaPluginCrypto",
    CAP_PLUGIN_METHOD(encrypt, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(encryptFile, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(decrypt, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(decryptFile, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(decryptFileFromURL, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(generateKeyPair, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(computeSharedSecret, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(computeED25519PublicKey, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(sign, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(verify, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(random, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(derive, CAPPluginReturnPromise);
)
