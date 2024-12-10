import type { PluginListenerHandle } from "@capacitor/core";

export type Data = DataView | string;

export interface InitializeOptions {
  androidNeverForLocation?: boolean;
}

export interface BooleanResult {
  value: boolean;
}

export interface StringResult {
  value: string;
}

export interface DeviceIdOptions {
  deviceId: string;
}

export interface TimeoutOptions {
  timeout?: number;
}

export interface BleScannerOptions {
  macFilter?: string;
  timeout?: number;
}

export interface BleDeviceAdvertisementData {
  rssi?: number;
  isConnectable?: boolean;
  manufacturerData?: BleDeviceManufacturerData;
}

export interface BleDeviceManufacturerData {
  companyIdentifier?: string;
  version?: number;
  componentType?: "handle" | "escutcheon" | "cylinder" | "wallreader" | "emzy" | "iobox" | "unknown";
  mainFirmwareVersionMajor?: number;
  mainFirmwareVersionMinor?: number;
  mainFirmwareVersionPatch?: number;
  componentHAL?: string;
  batteryStatus?: "battery-full" | "battery-empty";
  mainConstructionMode?: boolean;
  subConstructionMode?: boolean;
  isOnline?: boolean;
  officeModeEnabled?: boolean;
  twoFactorRequired?: boolean;
  officeModeActive?: boolean;
  identifier?: string;
  subFirmwareVersionMajor?: number;
  subFirmwareVersionMinor?: number;
  subFirmwareVersionPatch?: number;
  subComponentIdentifier?: string;
}

export interface BleDevice {
  deviceId: string;
  name?: string;
  advertisementData?: BleDeviceAdvertisementData;
}

export interface ReadOptions {
  deviceId: string;
  service: string;
  characteristic: string;
}

export interface ReadResult {
  value?: string;
}

export interface WriteOptions {
  deviceId: string;
  service: string;
  characteristic: string;
  value: string;
}

export interface SignalizeOptions {
  deviceId: string;
}

export interface DisengageOptions {
  deviceId: string;
  mobileId: string;
  mobileDeviceKey: string;
  mobileGroupId: string;
  mediumAccessData: string;
  isPermanentRelease: boolean;
}

export interface AbrevvaBLEInterface {
  initialize(options?: InitializeOptions): Promise<void>;
  isEnabled(): Promise<BooleanResult>;
  isLocationEnabled(): Promise<BooleanResult>;
  startEnabledNotifications(): Promise<void>;
  stopEnabledNotifications(): Promise<void>;
  openLocationSettings(): Promise<void>;
  openBluetoothSettings(): Promise<void>;
  openAppSettings(): Promise<void>;
  startScan(options?: BleScannerOptions): Promise<void>;
  stopScan(): Promise<void>;
  addListener(eventName: "onEnabledChanged", listenerFunc: (result: BooleanResult) => void): PluginListenerHandle;
  addListener(eventName: string, listenerFunc: (event: ReadResult) => void): PluginListenerHandle;
  addListener(eventName: "onScanResult", listenerFunc: (result: BleDevice) => void): PluginListenerHandle;
  addListener(eventName: "onScanStart", listenerFunc: (success: BooleanResult) => void): PluginListenerHandle;
  addListener(eventName: "onScanStop", listenerFunc: (success: BooleanResult) => void): PluginListenerHandle;
  connect(options: DeviceIdOptions & TimeoutOptions): Promise<void>;
  disconnect(options: DeviceIdOptions): Promise<void>;
  read(options: ReadOptions & TimeoutOptions): Promise<ReadResult>;
  write(options: WriteOptions & TimeoutOptions): Promise<void>;
  signalize(options: SignalizeOptions): Promise<void>;
  disengage(options: DisengageOptions): Promise<StringResult>;
  startNotifications(options: ReadOptions): Promise<void>;
  stopNotifications(options: ReadOptions): Promise<void>;
}
