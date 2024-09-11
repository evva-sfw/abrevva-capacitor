import { Component } from '@angular/core';
import { AbrevvaBLEClient, ScanResult } from '@evva-sfw/abrevva-capacitor'
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ble',
  templateUrl: './ble.component.html',
  styleUrls: ['./ble.component.css']
})
export class BleComponent {
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) { }

  results: ScanResult[] = []
  async onInit() {
    AbrevvaBLEClient.initialize({ androidNeverForLocation: true });
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async startScan(event: any) {
    const timeout = 5_000;

    this.results = [];
    await AbrevvaBLEClient.requestLEScan(
      { timeout: timeout },
      (result: ScanResult) => {
        this.results.push(result);
        result.device.deviceId
        this.changeDetectorRef.detectChanges();
      })
    setTimeout(() => {
      event.target.complete();
    }, timeout);
  }

  async disengage(device: ScanResult) {
    AbrevvaBLEClient.connect(device.device.deviceId,
      (device) => {
        console.log(`disconnected: ${device}`);
      },
      { timeout: 1_000 });

    AbrevvaBLEClient.disengage("deviveId", "mobileId", "mobileDeviceKey", "mobileGroupId", "mobileAccessData", true);
  }
}
