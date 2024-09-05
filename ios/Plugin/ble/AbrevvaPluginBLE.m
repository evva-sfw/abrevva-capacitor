#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(AbrevvaPluginBLE, "AbrevvaPluginBLE",
    CAP_PLUGIN_METHOD(initialize, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(isEnabled, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(isLocationEnabled, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(startEnabledNotifications, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(stopEnabledNotifications, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(openLocationSettings, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(openBluetoothSettings, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(openAppSettings, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(requestLEScan, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(stopLEScan, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(connect, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(disconnect, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(read, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(write, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(signalize, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(disengage, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(startNotifications, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(stopNotifications, CAPPluginReturnPromise);
)
