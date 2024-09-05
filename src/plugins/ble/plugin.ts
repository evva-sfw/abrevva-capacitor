import { registerPlugin } from '@capacitor/core';

import type { AbrevvaBLEInterface } from './definitions';

export const AbrevvaBLE = registerPlugin<AbrevvaBLEInterface>('AbrevvaPluginBLE');
