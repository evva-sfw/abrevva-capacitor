import { AbrevvaBLEInterface } from "./plugins/ble";
import { AbrevvaCryptoInterface } from "./plugins/crypto";
import { AbrevvaCodingStationInterface } from "./plugins/cs";

export * from "./plugins/ble/index";
export * from "./plugins/crypto/index";
export * from "./plugins/cs/index";

export interface AbrevvaInterface {
  AbrevvaBLEInterface: AbrevvaBLEInterface;
  AbrevvaCryptoInterface: AbrevvaCryptoInterface;
  AbrevvaCodingStationInterface: AbrevvaCodingStationInterface;
}
