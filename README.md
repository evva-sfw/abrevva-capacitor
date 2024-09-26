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

## Install

```bash
npm install @evva-sfw/abrevva-capacitor
npx cap sync
```

## API

<docgen-index>

* [`encrypt(...)`](#encrypt)
* [`encryptFile(...)`](#encryptfile)
* [`decrypt(...)`](#decrypt)
* [`decryptFile(...)`](#decryptfile)
* [`decryptFileFromURL(...)`](#decryptfilefromurl)
* [`generateKeyPair()`](#generatekeypair)
* [`computeSharedSecret(...)`](#computesharedsecret)
* [`computeED25519PublicKey(...)`](#computeed25519publickey)
* [`sign(...)`](#sign)
* [`verify(...)`](#verify)
* [`random(...)`](#random)
* [`derive(...)`](#derive)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### encrypt(...)

```typescript
encrypt(options: { key: string; iv: string; adata: string; pt: string; tagLength: number; }) => Promise<{ cipherText: string; authTag: string; }>
```

| Param         | Type                                                                                    |
| ------------- | --------------------------------------------------------------------------------------- |
| **`options`** | <code>{ key: string; iv: string; adata: string; pt: string; tagLength: number; }</code> |

**Returns:** <code>Promise&lt;{ cipherText: string; authTag: string; }&gt;</code>

--------------------


### encryptFile(...)

```typescript
encryptFile(options: { sharedSecret: string; ptPath: string; ctPath: string; }) => Promise<void>
```

| Param         | Type                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| **`options`** | <code>{ sharedSecret: string; ptPath: string; ctPath: string; }</code> |

--------------------


### decrypt(...)

```typescript
decrypt(options: { key: string; iv: string; adata: string; ct: string; tagLength: number; }) => Promise<{ plainText: string; authOk: boolean; }>
```

| Param         | Type                                                                                    |
| ------------- | --------------------------------------------------------------------------------------- |
| **`options`** | <code>{ key: string; iv: string; adata: string; ct: string; tagLength: number; }</code> |

**Returns:** <code>Promise&lt;{ plainText: string; authOk: boolean; }&gt;</code>

--------------------


### decryptFile(...)

```typescript
decryptFile(options: { sharedSecret: string; ctPath: string; ptPath: string; }) => Promise<void>
```

| Param         | Type                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| **`options`** | <code>{ sharedSecret: string; ctPath: string; ptPath: string; }</code> |

--------------------


### decryptFileFromURL(...)

```typescript
decryptFileFromURL(options: { sharedSecret: string; url: string; ptPath: string; }) => Promise<void>
```

| Param         | Type                                                                |
| ------------- | ------------------------------------------------------------------- |
| **`options`** | <code>{ sharedSecret: string; url: string; ptPath: string; }</code> |

--------------------


### generateKeyPair()

```typescript
generateKeyPair() => Promise<{ privateKey: string; publicKey: string; }>
```

**Returns:** <code>Promise&lt;{ privateKey: string; publicKey: string; }&gt;</code>

--------------------


### computeSharedSecret(...)

```typescript
computeSharedSecret(options: { privateKey: string; peerPublicKey: string; }) => Promise<{ sharedSecret: string; }>
```

| Param         | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| **`options`** | <code>{ privateKey: string; peerPublicKey: string; }</code> |

**Returns:** <code>Promise&lt;{ sharedSecret: string; }&gt;</code>

--------------------


### computeED25519PublicKey(...)

```typescript
computeED25519PublicKey(options: { privateKey: string; }) => Promise<{ publicKey: string; }>
```

| Param         | Type                                 |
| ------------- | ------------------------------------ |
| **`options`** | <code>{ privateKey: string; }</code> |

**Returns:** <code>Promise&lt;{ publicKey: string; }&gt;</code>

--------------------


### sign(...)

```typescript
sign(options: { privateKey: string; data: string; }) => Promise<{ signature: string; }>
```

| Param         | Type                                               |
| ------------- | -------------------------------------------------- |
| **`options`** | <code>{ privateKey: string; data: string; }</code> |

**Returns:** <code>Promise&lt;{ signature: string; }&gt;</code>

--------------------


### verify(...)

```typescript
verify(options: { publicKey: string; data: string; signature: string; }) => Promise<void>
```

| Param         | Type                                                                 |
| ------------- | -------------------------------------------------------------------- |
| **`options`** | <code>{ publicKey: string; data: string; signature: string; }</code> |

--------------------


### random(...)

```typescript
random(options: { numBytes: number; }) => Promise<{ value: string; }>
```

| Param         | Type                               |
| ------------- | ---------------------------------- |
| **`options`** | <code>{ numBytes: number; }</code> |

**Returns:** <code>Promise&lt;{ value: string; }&gt;</code>

--------------------


### derive(...)

```typescript
derive(options: { key: string; salt: string; info: string; length: number; }) => Promise<{ value: string; }>
```

| Param         | Type                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| **`options`** | <code>{ key: string; salt: string; info: string; length: number; }</code> |

**Returns:** <code>Promise&lt;{ value: string; }&gt;</code>

--------------------

</docgen-api>
