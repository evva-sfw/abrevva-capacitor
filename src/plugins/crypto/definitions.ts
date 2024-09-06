export interface AbrevvaCryptoInterface {
  encrypt(options: {
    key: string;
    iv: string;
    adata: string;
    pt: string;
    tagLength: number;
  }): Promise<{ cipherText: string; authTag: string }>;
  encryptFile(options: {
    sharedSecret: string;
    ptPath: string;
    ctPath: string;
  }): Promise<void>;
  decrypt(options: {
    key: string;
    iv: string;
    adata: string;
    ct: string;
    tagLength: number;
  }): Promise<{ plainText: string; authOk: boolean }>;
  decryptFile(options: {
    sharedSecret: string;
    ctPath: string;
    ptPath: string;
  }): Promise<void>;
  decryptFileFromURL(options: {
    sharedSecret: string;
    url: string;
    ptPath: string;
  }): Promise<void>;
  generateKeyPair(): Promise<{ privateKey: string; publicKey: string }>;
  computeSharedSecret(options: {
    privateKey: string;
    peerPublicKey: string;
  }): Promise<{ sharedSecret: string }>;
  computeED25519PublicKey(options: {
    privateKey: string;
  }): Promise<{ publicKey: string }>;
  sign(options: {
    privateKey: string;
    data: string;
  }): Promise<{ signature: string }>;
  verify(options: {
    publicKey: string;
    data: string;
    signature: string;
  }): Promise<void>;
  random(options: { numBytes: number }): Promise<{ value: string }>;
  derive(options: {
    key: string;
    salt: string;
    info: string;
    length: number;
  }): Promise<{ value: string }>;
}
