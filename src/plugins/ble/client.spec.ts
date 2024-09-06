/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { PluginListenerHandle } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';

import type { AbrevvaBLEClientInterface } from './client';
import { AbrevvaBLEClient } from './client';
import { hexStringToDataView, numbersToDataView } from './conversion';
import type { BleDevice } from './definitions';
import { AbrevvaBLE } from './plugin';

interface AbrevvaBLEClientWithPrivate extends AbrevvaBLEClientInterface {
  eventListeners: Map<string, PluginListenerHandle>;
  scanListener: PluginListenerHandle | null;
}

jest.mock('@capacitor/core', () => {
  return {
    __esModule: true,
    Capacitor: {
      getPlatform: jest.fn(),
    },
  };
});

jest.mock('./plugin', () => {
  const mockAbrevvaBLE = {
    initialize: jest.fn(),
    isEnabled: jest.fn(),
    addListener: jest.fn(),
    startEnabledNotifications: jest.fn(),
    stopEnabledNotifications: jest.fn(),
    requestDevice: jest.fn(),
    requestLEScan: jest.fn(),
    stopLEScan: jest.fn(),
    connect: jest.fn(),
    createBond: jest.fn(),
    isBonded: jest.fn(),
    disconnect: jest.fn(),
    read: jest.fn(),
    write: jest.fn(),
    signalize: jest.fn(),
    disengage: jest.fn(),
    writeWithoutResponse: jest.fn(),
    startNotifications: jest.fn(),
    stopNotifications: jest.fn(),
    readDescriptor: jest.fn(),
    writeDescriptor: jest.fn(),
  };
  return {
    __esModule: true,
    AbrevvaBLE: mockAbrevvaBLE,
  };
});

describe('AbrevvaBLEClient', () => {
  let mockDevice: BleDevice;
  const service = '00001234-0000-1000-8000-00805f9b34fb';
  const characteristic = '00001235-0000-1000-8000-00805f9b34fb';

  beforeEach(() => {
    jest.clearAllMocks();
    mockDevice = { deviceId: '123' };
  });

  it('should run initialize', async () => {
    await AbrevvaBLEClient.initialize();
    expect(AbrevvaBLE.initialize).toHaveBeenCalledTimes(1);
  });

  it('should run initialize with options', async () => {
    await AbrevvaBLEClient.initialize({ androidNeverForLocation: true });
    expect(AbrevvaBLE.initialize).toHaveBeenCalledTimes(1);
  });

  it('should run isEnabled', async () => {
    (AbrevvaBLE.isEnabled as jest.Mock).mockReturnValue({ value: true });
    const result = await AbrevvaBLEClient.isEnabled();
    expect(result).toBe(true);
    expect(AbrevvaBLE.isEnabled).toHaveBeenCalledTimes(1);
  });

  it('should run startEnabledNotifications', async () => {
    const mockCallback = jest.fn();
    const mockPluginListenerHandle = {
      remove: jest.fn(),
    };
    (AbrevvaBLE.addListener as jest.Mock).mockReturnValue(
      mockPluginListenerHandle,
    );

    await AbrevvaBLEClient.startEnabledNotifications(mockCallback);
    expect(AbrevvaBLE.addListener).toHaveBeenCalledWith(
      'onEnabledChanged',
      expect.any(Function),
    );
    expect(AbrevvaBLE.startEnabledNotifications).toHaveBeenCalledTimes(1);
    expect(
      (
        AbrevvaBLEClient as unknown as AbrevvaBLEClientWithPrivate
      ).eventListeners.get('onEnabledChanged'),
    ).toBe(mockPluginListenerHandle);
  });

  it('should remove previous event listener when running startEnabledNotifications twice', async () => {
    const mockCallback = jest.fn();
    const mockPluginListenerHandle = {
      remove: jest.fn(),
    };
    (AbrevvaBLE.addListener as jest.Mock).mockReturnValue(
      mockPluginListenerHandle,
    );

    await AbrevvaBLEClient.startEnabledNotifications(mockCallback);
    await AbrevvaBLEClient.startEnabledNotifications(mockCallback);
    expect(mockPluginListenerHandle.remove).toHaveBeenCalledTimes(1);
  });

  it('should run stopEnabledNotifications', async () => {
    const mockCallback = jest.fn();
    const mockPluginListenerHandle = {
      remove: jest.fn(),
    };
    (AbrevvaBLE.addListener as jest.Mock).mockReturnValue(
      mockPluginListenerHandle,
    );

    await AbrevvaBLEClient.startEnabledNotifications(mockCallback);
    expect(
      (
        AbrevvaBLEClient as unknown as AbrevvaBLEClientWithPrivate
      ).eventListeners.get('onEnabledChanged'),
    ).toBe(mockPluginListenerHandle);
    await AbrevvaBLEClient.stopEnabledNotifications();
    expect(mockPluginListenerHandle.remove).toHaveBeenCalledTimes(1);
    expect(AbrevvaBLE.stopEnabledNotifications).toHaveBeenCalledTimes(1);
    expect(
      (
        AbrevvaBLEClient as unknown as AbrevvaBLEClientWithPrivate
      ).eventListeners.get('onEnabledChanged'),
    ).toBeUndefined();
  });

  it('should run requestLEScan', async () => {
    const mockCallback = jest.fn();
    const mockScanListener = {
      remove: jest.fn(),
    };
    (AbrevvaBLE.addListener as jest.Mock).mockReturnValue(mockScanListener);
    await AbrevvaBLEClient.requestLEScan({}, mockCallback);
    expect(AbrevvaBLE.addListener).toHaveBeenCalledWith(
      'onScanResult',
      expect.any(Function),
    );
    expect(
      (AbrevvaBLEClient as unknown as AbrevvaBLEClientWithPrivate).scanListener,
    ).toBe(mockScanListener);
    expect(AbrevvaBLE.requestLEScan).toHaveBeenCalledTimes(1);
  });

  it('should run stopLEScan', async () => {
    const mockCallback = jest.fn();
    const mockScanListener = {
      remove: jest.fn(),
    };
    (AbrevvaBLE.addListener as jest.Mock).mockReturnValue(mockScanListener);
    await AbrevvaBLEClient.requestLEScan({}, mockCallback);
    expect(
      (AbrevvaBLEClient as unknown as AbrevvaBLEClientWithPrivate).scanListener,
    ).toBe(mockScanListener);
    await AbrevvaBLEClient.stopLEScan();
    expect(mockScanListener.remove).toHaveBeenCalledTimes(1);
    expect(
      (AbrevvaBLEClient as unknown as AbrevvaBLEClientWithPrivate).scanListener,
    ).toBe(null);
    expect(AbrevvaBLE.stopLEScan).toHaveBeenCalledTimes(1);
  });

  it('should run connect without disconnect callback', async () => {
    const mockPluginListenerHandle = {
      remove: jest.fn(),
    };
    (AbrevvaBLE.addListener as jest.Mock).mockReturnValue(
      mockPluginListenerHandle,
    );
    await AbrevvaBLEClient.connect(mockDevice.deviceId);
    expect(
      (
        AbrevvaBLEClient as unknown as AbrevvaBLEClientWithPrivate
      ).eventListeners.get('disconnected|123'),
    ).toBeUndefined();
    expect(AbrevvaBLE.connect).toHaveBeenCalledWith({
      deviceId: mockDevice.deviceId,
    });
  });

  it('should register disconnect callback', async () => {
    const mockDisconnectCallback = jest.fn();
    const mockPluginListenerHandle = {
      remove: jest.fn(),
    };
    (AbrevvaBLE.addListener as jest.Mock).mockReturnValue(
      mockPluginListenerHandle,
    );
    await AbrevvaBLEClient.connect(mockDevice.deviceId, mockDisconnectCallback);
    expect(
      (
        AbrevvaBLEClient as unknown as AbrevvaBLEClientWithPrivate
      ).eventListeners.get('disconnected|123'),
    ).toBe(mockPluginListenerHandle);
    expect(AbrevvaBLE.connect).toHaveBeenCalledTimes(1);
  });

  it('should run connect with timeout', async () => {
    await AbrevvaBLEClient.connect(mockDevice.deviceId, () => undefined, {
      timeout: 20000,
    });
    expect(AbrevvaBLE.connect).toHaveBeenCalledWith({
      deviceId: mockDevice.deviceId,
      timeout: 20000,
    });
  });

  it('should run disconnect', async () => {
    await AbrevvaBLEClient.disconnect(mockDevice.deviceId);
    expect(AbrevvaBLE.disconnect).toHaveBeenCalledWith({
      deviceId: mockDevice.deviceId,
    });
  });

  it('should run read', async () => {
    (AbrevvaBLE.read as jest.Mock).mockReturnValue({ value: '00 05 c8 ' });
    const result = await AbrevvaBLEClient.read(
      mockDevice.deviceId,
      service,
      characteristic,
    );
    expect(result).toEqual(hexStringToDataView('00 05 c8'));
    expect(AbrevvaBLE.read).toHaveBeenCalledWith({
      deviceId: mockDevice.deviceId,
      service,
      characteristic,
    });
  });

  it('should run read with timeout', async () => {
    (AbrevvaBLE.read as jest.Mock).mockReturnValue({ value: '00 05 c8 ' });
    await AbrevvaBLEClient.read(mockDevice.deviceId, service, characteristic, {
      timeout: 6000,
    });
    expect(AbrevvaBLE.read).toHaveBeenCalledWith({
      deviceId: mockDevice.deviceId,
      service,
      characteristic,
      timeout: 6000,
    });
  });

  it('should run write string on native platform', async () => {
    (Capacitor.getPlatform as jest.Mock).mockReturnValue('android');
    expect(Capacitor.getPlatform()).toBe('android');

    await AbrevvaBLEClient.write(
      mockDevice.deviceId,
      service,
      characteristic,
      numbersToDataView([0, 1]),
    );
    expect(AbrevvaBLE.write).toHaveBeenCalledWith({
      deviceId: mockDevice.deviceId,
      service,
      characteristic,
      value: '00 01',
    });
  });

  it('should run write with timeout', async () => {
    (Capacitor.getPlatform as jest.Mock).mockReturnValue('android');
    await AbrevvaBLEClient.write(
      mockDevice.deviceId,
      service,
      characteristic,
      numbersToDataView([0, 1]),
      { timeout: 6000 },
    );
    expect(AbrevvaBLE.write).toHaveBeenCalledWith({
      deviceId: mockDevice.deviceId,
      service,
      characteristic,
      value: '00 01',
      timeout: 6000,
    });
  });

  it('should run signalize on native platform', async () => {
    (Capacitor.getPlatform as jest.Mock).mockReturnValue('android');
    expect(Capacitor.getPlatform()).toBe('android');

    await AbrevvaBLEClient.signalize(mockDevice.deviceId);
    expect(AbrevvaBLE.signalize).toHaveBeenCalledWith({
      deviceId: mockDevice.deviceId,
    });
  });

  it('should run disengage on native platform', async () => {
    (Capacitor.getPlatform as jest.Mock).mockReturnValue('android');
    expect(Capacitor.getPlatform()).toBe('android');

    (AbrevvaBLE.disengage as jest.Mock).mockReturnValue({
      value: 'ACCESS_STATUS_AUTHORIZED',
    });
    const result = await AbrevvaBLEClient.disengage(
      mockDevice.deviceId,
      '',
      '',
      '',
      '',
      false,
    );
    expect(AbrevvaBLE.disengage).toHaveBeenCalledWith({
      deviceId: mockDevice.deviceId,
      mobileId: '',
      mobileDeviceKey: '',
      mobileGroupId: '',
      mobileAccessData: '',
      isPermanentRelease: false,
    });
    expect(result).toEqual('ACCESS_STATUS_AUTHORIZED');
  });

  it('should run startNotifications', async () => {
    const mockCallback = jest.fn();
    const mockPluginListenerHandle = {
      remove: jest.fn(),
    };
    (AbrevvaBLE.addListener as jest.Mock).mockReturnValue(
      mockPluginListenerHandle,
    );

    await AbrevvaBLEClient.startNotifications(
      mockDevice.deviceId,
      service,
      characteristic,
      mockCallback,
    );
    const key =
      'notification|123|00001234-0000-1000-8000-00805f9b34fb|00001235-0000-1000-8000-00805f9b34fb';
    expect(AbrevvaBLE.addListener).toHaveBeenCalledWith(
      key,
      expect.any(Function),
    );
    expect(AbrevvaBLE.startNotifications).toHaveBeenCalledWith({
      deviceId: mockDevice.deviceId,
      service,
      characteristic,
    });
    expect(
      (
        AbrevvaBLEClient as unknown as AbrevvaBLEClientWithPrivate
      ).eventListeners.get(key),
    ).toBe(mockPluginListenerHandle);
  });

  it('should run stopNotifications', async () => {
    const mockCallback = jest.fn();
    const mockPluginListenerHandle = {
      remove: jest.fn(),
    };
    (AbrevvaBLE.addListener as jest.Mock).mockReturnValue(
      mockPluginListenerHandle,
    );

    const key =
      'notification|123|00001234-0000-1000-8000-00805f9b34fb|00001235-0000-1000-8000-00805f9b34fb';
    await AbrevvaBLEClient.startNotifications(
      mockDevice.deviceId,
      service,
      characteristic,
      mockCallback,
    );
    expect(
      (
        AbrevvaBLEClient as unknown as AbrevvaBLEClientWithPrivate
      ).eventListeners.get(key),
    ).toBe(mockPluginListenerHandle);
    await AbrevvaBLEClient.stopNotifications(
      mockDevice.deviceId,
      service,
      characteristic,
    );
    expect(AbrevvaBLE.stopNotifications).toHaveBeenCalledWith({
      deviceId: mockDevice.deviceId,
      service,
      characteristic,
    });
    expect(mockPluginListenerHandle.remove).toHaveBeenCalledTimes(1);
    expect(
      (
        AbrevvaBLEClient as unknown as AbrevvaBLEClientWithPrivate
      ).eventListeners.get(key),
    ).toBeUndefined();
  });
});
