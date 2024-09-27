<p align="center">
  <h1 align="center">Capacitor Abrevva Plugin</h1>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@evva-sfw/abrevva-capacitor">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/%40evva-sfw%2Fabrevva-capacitor"></a>
  <a href="https://www.npmjs.com/package/@evva-sfw/abrevva-capacitor">
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dy/%40evva-sfw%2Fabrevva-capacitor"></a>
  <img alt="GitHub package.json dynamic" src="https://img.shields.io/github/package-json/packageManager/evva-sfw/abrevva-capacitor">
  <img alt="NPM Unpacked Size (with version)" src="https://img.shields.io/npm/unpacked-size/%40evva-sfw%2Fabrevva-capacitor/latest">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/evva-sfw/abrevva-capacitor">
  <a href="https://github.com/evva-sfw/abrevva-capacitor/actions"><img alt="GitHub branch check runs" src="https://img.shields.io/github/check-runs/evva-sfw/abrevva-capacitor/main"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-EVVA_License-yellow.svg?color=fce500&logo=data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjY0MCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgNjQwIDEwMjQiPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiNmY2U1MDAiIGQ9Ik02MjIuNDIzIDUxMS40NDhsLTMzMS43NDYtNDY0LjU1MmgtMjg4LjE1N2wzMjkuODI1IDQ2NC41NTItMzI5LjgyNSA0NjYuNjY0aDI3NS42MTJ6Ij48L3BhdGg+Cjwvc3ZnPgo=" alt="EVVA License"></a>
</p>

The EVVA Capacitor Plugin is a collection of tools to work with electronical EVVA access components. It allows for scanning and connecting via BLE.

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Examples](#examples)

## Features

- BLE Scanner for EVVA components in range
- Localize EVVA components encountered by a scan
- Disengage EVVA components encountered by a scan
- Read / Write data via BLE

## Requirements

- Capacitor >= 5.0.0
- Java 17+ (Android)
- Android SDK (Android)
- Android 10+ (API level 29) (Android)
- Xcode 15.4 (iOS)
- iOS 15.0+ (iOS)

## Installation

### Capacitor 6

```
npm install @evva-sfw/abrevva-capacitor
npx cap sync
```

### Capacitor 5

```
npm install @evva-sfw/abrevva-capacitor@1.0.1
npx cap sync
```

## Examples

### Initialize and scan for EVVA components

```typescript
import { AbrevvaBLEClient, ScanResult } from "@evva-sfw/abrevva-capacitor";

class ExampleClass {
  private results: ScanResult[];
  
  async startScan(event: any) {
    this.results = [];
    
    await AbrevvaBLEClient.requestLEScan({ timeout: 5_000 }, (result: ScanResult) => {
      this.results.push(result);
    });
  }
}
```

### Localize EVVA component

With the signalize method you can localize EVVA components. On a successful signalization the component will emit a melody indicating its location.

```typescript
const success = await AbrevvaBLEClient.signalize('deviceId');
```

### Perform disengage on EVVA components

For the component disengage you have to provide access credentials to the EVVA component. Those are generally acquired in the form of access media metadata from the Xesar software.

```typescript
const status = await AbrevvaBLEClient.disengage(
  'mobileId',
  'mobileDeviceKey',
  'mobileGroupId',
  'mobileAccessData',
  false,
);
```

## API

<docgen-index>

* [Interfaces](#interfaces)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### Interfaces


#### AbrevvaBLEInterface

| Method                        | Signature                                                                                                                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **initialize**                | (options?: <a href="#initializeoptions">InitializeOptions</a> \| undefined) =&gt; Promise&lt;void&gt;                                                                               |
| **isEnabled**                 | () =&gt; Promise&lt;<a href="#booleanresult">BooleanResult</a>&gt;                                                                                                                  |
| **isLocationEnabled**         | () =&gt; Promise&lt;<a href="#booleanresult">BooleanResult</a>&gt;                                                                                                                  |
| **startEnabledNotifications** | () =&gt; Promise&lt;void&gt;                                                                                                                                                        |
| **stopEnabledNotifications**  | () =&gt; Promise&lt;void&gt;                                                                                                                                                        |
| **openLocationSettings**      | () =&gt; Promise&lt;void&gt;                                                                                                                                                        |
| **openBluetoothSettings**     | () =&gt; Promise&lt;void&gt;                                                                                                                                                        |
| **openAppSettings**           | () =&gt; Promise&lt;void&gt;                                                                                                                                                        |
| **requestLEScan**             | (options?: <a href="#requestbledeviceoptions">RequestBleDeviceOptions</a> \| undefined) =&gt; Promise&lt;void&gt;                                                                   |
| **stopLEScan**                | () =&gt; Promise&lt;void&gt;                                                                                                                                                        |
| **addListener**               | (eventName: "onEnabledChanged", listenerFunc: (result: <a href="#booleanresult">BooleanResult</a>) =&gt; void) =&gt; <a href="#pluginlistenerhandle">PluginListenerHandle</a>       |
| **addListener**               | (eventName: string, listenerFunc: (event: <a href="#readresult">ReadResult</a>) =&gt; void) =&gt; <a href="#pluginlistenerhandle">PluginListenerHandle</a>                          |
| **addListener**               | (eventName: "onScanResult", listenerFunc: (result: <a href="#scanresultinternal">ScanResultInternal</a>) =&gt; void) =&gt; <a href="#pluginlistenerhandle">PluginListenerHandle</a> |
| **connect**                   | (options: <a href="#deviceidoptions">DeviceIdOptions</a> & <a href="#timeoutoptions">TimeoutOptions</a>) =&gt; Promise&lt;void&gt;                                                  |
| **disconnect**                | (options: <a href="#deviceidoptions">DeviceIdOptions</a>) =&gt; Promise&lt;void&gt;                                                                                                 |
| **read**                      | (options: <a href="#readoptions">ReadOptions</a> & <a href="#timeoutoptions">TimeoutOptions</a>) =&gt; Promise&lt;<a href="#readresult">ReadResult</a>&gt;                          |
| **write**                     | (options: <a href="#writeoptions">WriteOptions</a> & <a href="#timeoutoptions">TimeoutOptions</a>) =&gt; Promise&lt;void&gt;                                                        |
| **signalize**                 | (options: <a href="#signalizeoptions">SignalizeOptions</a>) =&gt; Promise&lt;void&gt;                                                                                               |
| **disengage**                 | (options: <a href="#disengageoptions">DisengageOptions</a>) =&gt; Promise&lt;<a href="#stringresult">StringResult</a>&gt;                                                           |
| **startNotifications**        | (options: <a href="#readoptions">ReadOptions</a>) =&gt; Promise&lt;void&gt;                                                                                                         |
| **stopNotifications**         | (options: <a href="#readoptions">ReadOptions</a>) =&gt; Promise&lt;void&gt;                                                                                                         |


#### InitializeOptions

| Prop                          | Type                 |
| ----------------------------- | -------------------- |
| **`androidNeverForLocation`** | <code>boolean</code> |


#### BooleanResult

| Prop        | Type                 |
| ----------- | -------------------- |
| **`value`** | <code>boolean</code> |


#### RequestBleDeviceOptions

| Prop                   | Type                                          |
| ---------------------- | --------------------------------------------- |
| **`services`**         | <code>string[]</code>                         |
| **`name`**             | <code>string</code>                           |
| **`namePrefix`**       | <code>string</code>                           |
| **`optionalServices`** | <code>string[]</code>                         |
| **`allowDuplicates`**  | <code>boolean</code>                          |
| **`scanMode`**         | <code><a href="#scanmode">ScanMode</a></code> |
| **`timeout`**          | <code>number</code>                           |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### ReadResult

| Prop        | Type                |
| ----------- | ------------------- |
| **`value`** | <code>string</code> |


#### ScanResultInternal

| Prop                   | Type                                            |
| ---------------------- | ----------------------------------------------- |
| **`device`**           | <code><a href="#bledevice">BleDevice</a></code> |
| **`localName`**        | <code>string</code>                             |
| **`rssi`**             | <code>number</code>                             |
| **`txPower`**          | <code>number</code>                             |
| **`manufacturerData`** | <code>{ [key: string]: T; }</code>              |
| **`serviceData`**      | <code>{ [key: string]: T; }</code>              |
| **`uuids`**            | <code>string[]</code>                           |
| **`rawAdvertisement`** | <code>T</code>                                  |


#### BleDevice

| Prop           | Type                  |
| -------------- | --------------------- |
| **`deviceId`** | <code>string</code>   |
| **`name`**     | <code>string</code>   |
| **`uuids`**    | <code>string[]</code> |


#### DeviceIdOptions

| Prop           | Type                |
| -------------- | ------------------- |
| **`deviceId`** | <code>string</code> |


#### TimeoutOptions

| Prop          | Type                |
| ------------- | ------------------- |
| **`timeout`** | <code>number</code> |


#### ReadOptions

| Prop                 | Type                |
| -------------------- | ------------------- |
| **`deviceId`**       | <code>string</code> |
| **`service`**        | <code>string</code> |
| **`characteristic`** | <code>string</code> |


#### WriteOptions

| Prop                 | Type                |
| -------------------- | ------------------- |
| **`deviceId`**       | <code>string</code> |
| **`service`**        | <code>string</code> |
| **`characteristic`** | <code>string</code> |
| **`value`**          | <code>string</code> |


#### SignalizeOptions

| Prop           | Type                |
| -------------- | ------------------- |
| **`deviceId`** | <code>string</code> |


#### StringResult

| Prop        | Type                |
| ----------- | ------------------- |
| **`value`** | <code>string</code> |


#### DisengageOptions

| Prop                     | Type                 |
| ------------------------ | -------------------- |
| **`deviceId`**           | <code>string</code>  |
| **`mobileId`**           | <code>string</code>  |
| **`mobileDeviceKey`**    | <code>string</code>  |
| **`mobileGroupId`**      | <code>string</code>  |
| **`mobileAccessData`**   | <code>string</code>  |
| **`isPermanentRelease`** | <code>boolean</code> |


#### AbrevvaCryptoInterface

| Method                      | Signature                                                                                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **encrypt**                 | (options: { key: string; iv: string; adata: string; pt: string; tagLength: number; }) =&gt; Promise&lt;{ cipherText: string; authTag: string; }&gt; |
| **encryptFile**             | (options: { sharedSecret: string; ptPath: string; ctPath: string; }) =&gt; Promise&lt;void&gt;                                                      |
| **decrypt**                 | (options: { key: string; iv: string; adata: string; ct: string; tagLength: number; }) =&gt; Promise&lt;{ plainText: string; authOk: boolean; }&gt;  |
| **decryptFile**             | (options: { sharedSecret: string; ctPath: string; ptPath: string; }) =&gt; Promise&lt;void&gt;                                                      |
| **decryptFileFromURL**      | (options: { sharedSecret: string; url: string; ptPath: string; }) =&gt; Promise&lt;void&gt;                                                         |
| **generateKeyPair**         | () =&gt; Promise&lt;{ privateKey: string; publicKey: string; }&gt;                                                                                  |
| **computeSharedSecret**     | (options: { privateKey: string; peerPublicKey: string; }) =&gt; Promise&lt;{ sharedSecret: string; }&gt;                                            |
| **computeED25519PublicKey** | (options: { privateKey: string; }) =&gt; Promise&lt;{ publicKey: string; }&gt;                                                                      |
| **sign**                    | (options: { privateKey: string; data: string; }) =&gt; Promise&lt;{ signature: string; }&gt;                                                        |
| **verify**                  | (options: { publicKey: string; data: string; signature: string; }) =&gt; Promise&lt;void&gt;                                                        |
| **random**                  | (options: { numBytes: number; }) =&gt; Promise&lt;{ value: string; }&gt;                                                                            |
| **derive**                  | (options: { key: string; salt: string; info: string; length: number; }) =&gt; Promise&lt;{ value: string; }&gt;                                     |


### Enums


#### ScanMode

| Members                     | Value          |
| --------------------------- | -------------- |
| **`SCAN_MODE_LOW_POWER`**   | <code>0</code> |
| **`SCAN_MODE_BALANCED`**    | <code>1</code> |
| **`SCAN_MODE_LOW_LATENCY`** | <code>2</code> |

</docgen-api>
