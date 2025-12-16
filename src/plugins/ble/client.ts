import type { PluginListenerHandle } from "@capacitor/core";

import { dataViewToHexString, hexStringToDataView } from "./conversion";
import {
  BleDevice,
  BleScannerOptions,
  Data,
  DisengageStatusType,
  InitializeOptions,
  ReadResult,
  TimeoutOptions,
} from "./definitions";
import { AbrevvaBLE } from "./plugin";
import { getQueue } from "./queue";
import { validateUUID } from "./validators";

export interface AbrevvaBLEClientInterface {
  initialize(options?: InitializeOptions): Promise<void>;
  isEnabled(): Promise<boolean>;
  isLocationEnabled(): Promise<boolean>;
  startEnabledNotifications(callback: (value: boolean) => void): Promise<void>;
  stopEnabledNotifications(): Promise<void>;
  openLocationSettings(): Promise<void>;
  openBluetoothSettings(): Promise<void>;
  openAppSettings(): Promise<void>;
  startScan(
    options: BleScannerOptions,
    onScanResult: (result: BleDevice) => void,
    onScanStart?: (success: boolean) => void,
    onScanStop?: (success: boolean) => void,
  ): Promise<void>;
  stopScan(): Promise<void>;
  connect(deviceId: string, onDisconnect?: (deviceId: string) => void, options?: TimeoutOptions): Promise<void>;
  disconnect(deviceId: string): Promise<void>;
  read(deviceId: string, service: string, characteristic: string, options?: TimeoutOptions): Promise<DataView>;
  write(
    deviceId: string,
    service: string,
    characteristic: string,
    value: DataView,
    options?: TimeoutOptions,
  ): Promise<void>;
  signalize(deviceId: string): Promise<void>;
  disengage(
    deviceId: string,
    mobileId: string,
    mobileDeviceKey: string,
    mobileGroupId: string,
    mediumAccessData: string,
    isPermanentRelease: boolean,
  ): Promise<string>;
  disengageWithXvnResponse(
    deviceId: string,
    mobileId: string,
    mobileDeviceKey: string,
    mobileGroupId: string,
    mediumAccessData: string,
    isPermanentRelease: boolean,
  ): Promise<{ status: DisengageStatusType; xvnData?: string }>;
  startNotifications(
    deviceId: string,
    service: string,
    characteristic: string,
    callback: (value: DataView) => void,
  ): Promise<void>;
  stopNotifications(deviceId: string, service: string, characteristic: string): Promise<void>;
}

class AbrevvaBLEClientClass implements AbrevvaBLEClientInterface {
  private scanResultListener: PluginListenerHandle | null = null;
  private scanStartListener: PluginListenerHandle | null = null;
  private scanStopListener: PluginListenerHandle | null = null;

  private eventListeners = new Map<string, PluginListenerHandle>();
  private queue = getQueue(true);

  async initialize(options?: InitializeOptions): Promise<void> {
    await this.queue(async () => {
      await AbrevvaBLE.initialize(options);
    });
  }

  async isEnabled(): Promise<boolean> {
    return await this.queue(async () => {
      const result = await AbrevvaBLE.isEnabled();
      return result.value;
    });
  }

  async isLocationEnabled(): Promise<boolean> {
    return await this.queue(async () => {
      const result = await AbrevvaBLE.isLocationEnabled();
      return result.value;
    });
  }

  async startEnabledNotifications(callback: (value: boolean) => void): Promise<void> {
    await this.queue(async () => {
      const key = `onEnabledChanged`;
      await this.eventListeners.get(key)?.remove();
      const listener = AbrevvaBLE.addListener(key, (result) => {
        callback(result.value);
      });
      this.eventListeners.set(key, listener);
      await AbrevvaBLE.startEnabledNotifications();
    });
  }

  async stopEnabledNotifications(): Promise<void> {
    await this.queue(async () => {
      const key = `onEnabledChanged`;
      await this.eventListeners.get(key)?.remove();
      this.eventListeners.delete(key);
      await AbrevvaBLE.stopEnabledNotifications();
    });
  }

  async openLocationSettings(): Promise<void> {
    await this.queue(async () => {
      await AbrevvaBLE.openLocationSettings();
    });
  }

  async openBluetoothSettings(): Promise<void> {
    await this.queue(async () => {
      await AbrevvaBLE.openBluetoothSettings();
    });
  }

  async openAppSettings(): Promise<void> {
    await this.queue(async () => {
      await AbrevvaBLE.openAppSettings();
    });
  }

  async startScan(
    options: BleScannerOptions,
    onScanResult: (result: BleDevice) => void,
    onScanStart?: (success: boolean) => void,
    onScanStop?: (success: boolean) => void,
  ): Promise<void> {
    await this.queue(async () => {
      await this.scanResultListener?.remove();
      this.scanResultListener = AbrevvaBLE.addListener("onScanResult", (device: BleDevice) => {
        onScanResult(device);
      });
      if (onScanStart) {
        await this.scanStartListener?.remove();
        this.scanStartListener = AbrevvaBLE.addListener("onScanStart", (result) => {
          onScanStart(result.value);
          this.scanStartListener?.remove();
        });
      }
      if (onScanStop) {
        await this.scanStopListener?.remove();
        this.scanStopListener = AbrevvaBLE.addListener("onScanStop", (result) => {
          onScanStop(result.value);
          this.scanStopListener?.remove();
        });
      }
      await AbrevvaBLE.startScan(options);
    });
  }

  async stopScan(): Promise<void> {
    await this.queue(async () => {
      await this.scanResultListener?.remove();
      this.scanResultListener = null;
      await AbrevvaBLE.stopScan();
    });
  }

  async connect(deviceId: string, onDisconnect?: (deviceId: string) => void, options?: TimeoutOptions): Promise<void> {
    await this.queue(async () => {
      if (onDisconnect) {
        const key = `disconnected|${deviceId}`;
        await this.eventListeners.get(key)?.remove();
        const listener = AbrevvaBLE.addListener(key, () => {
          onDisconnect(deviceId);
        });
        this.eventListeners.set(key, listener);
      }
      await AbrevvaBLE.connect({ deviceId, ...options });
    });
  }

  async disconnect(deviceId: string): Promise<void> {
    await this.queue(async () => {
      await AbrevvaBLE.disconnect({ deviceId });
    });
  }

  async read(deviceId: string, service: string, characteristic: string, options?: TimeoutOptions): Promise<DataView> {
    service = validateUUID(service);
    characteristic = validateUUID(characteristic);
    return await this.queue(async () => {
      const result = await AbrevvaBLE.read({
        deviceId,
        service,
        characteristic,
        ...options,
      });
      return this.convertValue(result.value);
    });
  }

  async write(
    deviceId: string,
    service: string,
    characteristic: string,
    value: DataView,
    options?: TimeoutOptions,
  ): Promise<void> {
    service = validateUUID(service);
    characteristic = validateUUID(characteristic);
    return this.queue(async () => {
      if (!value?.buffer) {
        throw new Error("Invalid data.");
      }
      const writeValue = dataViewToHexString(value);
      await AbrevvaBLE.write({
        deviceId,
        service,
        characteristic,
        value: writeValue,
        ...options,
      });
    });
  }

  async signalize(deviceId: string): Promise<void> {
    return await this.queue(async () => {
      return AbrevvaBLE.signalize({ deviceId });
    });
  }

  async disengage(
    deviceId: string,
    mobileId: string,
    mobileDeviceKey: string,
    mobileGroupId: string,
    mediumAccessData: string,
    isPermanentRelease: boolean,
    onConnect?: (address: string) => void,
    onDisconnect?: (address: string) => void,
  ): Promise<DisengageStatusType> {
    return await this.queue(async () => {
      if (onConnect) {
        await this.eventListeners.get(`connected|${deviceId}`)?.remove();
        this.eventListeners.set(
          `connected|${deviceId}`,
          AbrevvaBLE.addListener(`connected|${deviceId}`, () => {
            onConnect(deviceId);
          }),
        );
      }
      if (onDisconnect) {
        await this.eventListeners.get(`disconnected|${deviceId}`)?.remove();
        this.eventListeners.set(
          `disconnected|${deviceId}`,
          AbrevvaBLE.addListener(`disconnected|${deviceId}`, () => {
            onDisconnect(deviceId);
          }),
        );
      }

      const status = (
        await AbrevvaBLE.disengage({
          deviceId,
          mobileId,
          mobileDeviceKey,
          mobileGroupId,
          mediumAccessData,
          isPermanentRelease,
        })
      ).value;

      let result: DisengageStatusType;
      if (Object.values(DisengageStatusType).some((val: string) => val === status)) {
        result = <DisengageStatusType>status;
      } else {
        result = DisengageStatusType.Error;
      }
      return result;
    });
  }

  async disengageWithXvnResponse(
    deviceId: string,
    mobileId: string,
    mobileDeviceKey: string,
    mobileGroupId: string,
    mediumAccessData: string,
    isPermanentRelease: boolean,
    onConnect?: (address: string) => void,
    onDisconnect?: (address: string) => void,
  ): Promise<{ status: DisengageStatusType; xvnData?: string }> {
    return await this.queue(async () => {
      if (onConnect) {
        await this.eventListeners.get(`connected|${deviceId}`)?.remove();
        this.eventListeners.set(
          `connected|${deviceId}`,
          AbrevvaBLE.addListener(`connected|${deviceId}`, () => {
            onConnect(deviceId);
          }),
        );
      }
      if (onDisconnect) {
        await this.eventListeners.get(`disconnected|${deviceId}`)?.remove();
        this.eventListeners.set(
          `disconnected|${deviceId}`,
          AbrevvaBLE.addListener(`disconnected|${deviceId}`, () => {
            onDisconnect(deviceId);
          }),
        );
      }

      const response = await AbrevvaBLE.disengageWithXvnResponse({
        deviceId,
        mobileId,
        mobileDeviceKey,
        mobileGroupId,
        mediumAccessData,
        isPermanentRelease,
      });

      let status: DisengageStatusType;
      if (Object.values(DisengageStatusType).some((val: string) => val === response.status)) {
        status = <DisengageStatusType>response.status;
      } else {
        status = DisengageStatusType.Error;
      }

      return { status, xvnData: response.xvnData };
    });
  }

  async startNotifications(
    deviceId: string,
    service: string,
    characteristic: string,
    callback: (value: DataView) => void,
  ): Promise<void> {
    service = validateUUID(service);
    characteristic = validateUUID(characteristic);
    await this.queue(async () => {
      const key = `notification|${deviceId}|${service}|${characteristic}`;
      await this.eventListeners.get(key)?.remove();
      const listener = AbrevvaBLE.addListener(key, (event: ReadResult) => {
        callback(this.convertValue(event?.value));
      });
      this.eventListeners.set(key, listener);
      await AbrevvaBLE.startNotifications({
        deviceId,
        service,
        characteristic,
      });
    });
  }

  async stopNotifications(deviceId: string, service: string, characteristic: string): Promise<void> {
    service = validateUUID(service);
    characteristic = validateUUID(characteristic);
    await this.queue(async () => {
      const key = `notification|${deviceId}|${service}|${characteristic}`;
      await this.eventListeners.get(key)?.remove();
      this.eventListeners.delete(key);
      await AbrevvaBLE.stopNotifications({
        deviceId,
        service,
        characteristic,
      });
    });
  }

  private convertValue(value?: Data): DataView {
    if (typeof value === "string") {
      return hexStringToDataView(value);
    } else if (value === undefined) {
      return new DataView(new ArrayBuffer(0));
    }
    return value;
  }
}

export const AbrevvaBLEClient = new AbrevvaBLEClientClass();
