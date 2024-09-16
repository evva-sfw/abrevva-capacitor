import { registerPlugin } from "@capacitor/core";

import type { AbrevvaPluginNFCInterface } from "./definitions";

export const AbrevvaPluginNFC = registerPlugin<AbrevvaPluginNFCInterface>("AbrevvaPluginNFC");
