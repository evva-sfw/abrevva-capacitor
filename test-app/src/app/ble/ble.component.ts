import { Component, OnInit } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import { AbrevvaBLEClient, BleDevice } from "@evva/abrevva-capacitor";

@Component({
  selector: "app-ble",
  templateUrl: "./ble.component.html",
  styleUrls: ["./ble.component.css"],
})
export class BleComponent implements OnInit {
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  results: BleDevice[] = [];

  async ngOnInit() {
    await AbrevvaBLEClient.initialize({ androidNeverForLocation: true });
  }

  async startScan(event: any) {
    const timeout = 5_000;

    this.results = [];
    await AbrevvaBLEClient.startScan({ timeout: timeout }, (result: BleDevice) => {
      this.results.push(result);
      this.changeDetectorRef.detectChanges();
    });
    setTimeout(() => {
      event.target.complete();
    }, timeout);
  }

  async disengage(device: BleDevice) {
    await AbrevvaBLEClient.stopScan();
    const result = await AbrevvaBLEClient.disengage(
      device.deviceId,
      "mobileId",
      "mobileDeviceKey",
      "mobileGroupId",
      "mediumAccessData",
      true,
    );
    console.log(`Disengage Status: ${result}`);
  }
}
