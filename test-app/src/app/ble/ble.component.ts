import { Component, OnInit } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import { AbrevvaBLEClient, ScanResult } from "@evva/abrevva-capacitor";

@Component({
  selector: "app-ble",
  templateUrl: "./ble.component.html",
  styleUrls: ["./ble.component.css"],
})
export class BleComponent implements OnInit {
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  results: ScanResult[] = [];

  async ngOnInit() {
    await AbrevvaBLEClient.initialize({ androidNeverForLocation: true });
  }

  async startScan(event: any) {
    const timeout = 5_000;

    this.results = [];
    await AbrevvaBLEClient.requestLEScan({ timeout: timeout }, (result: ScanResult) => {
      this.results.push(result);
      result.device.deviceId;
      this.changeDetectorRef.detectChanges();
    });
    setTimeout(() => {
      event.target.complete();
    }, timeout);
  }

  async disengage(device: ScanResult) {
    await AbrevvaBLEClient.connect(
      device.device.deviceId,
      (device) => {
        console.log(`disconnected: ${device}`);
      },
      { timeout: 1_000 },
    );

    await AbrevvaBLEClient.disengage(
      "deviveId",
      "mobileId",
      "mobileDeviceKey",
      "mobileGroupId",
      "mobileAccessData",
      true,
    );
  }
}
