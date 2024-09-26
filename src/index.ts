import { AbrevvaBLEInterface } from "./plugins/ble";
import { AbrevvaCryptoInterface } from "./plugins/crypto";

export * from "./plugins/ble/index";
export * from "./plugins/crypto/index";

export interface AbrevvaInterface {
  AbrevvaBLEInterface: AbrevvaBLEInterface;
  AbrevvaCryptoInterface: AbrevvaCryptoInterface;
}
