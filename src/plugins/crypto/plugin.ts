import { registerPlugin } from '@capacitor/core';

import type { AbrevvaCryptoInterface } from './definitions';

export const AbrevvaCrypto = registerPlugin<AbrevvaCryptoInterface>(
  'AbrevvaPluginCrypto',
);
