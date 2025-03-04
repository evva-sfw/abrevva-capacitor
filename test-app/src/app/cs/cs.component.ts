import { Component } from "@angular/core";
import { AbrevvaCodingStation } from "@evva/abrevva-capacitor";

@Component({
  selector: "app-cs",
  templateUrl: "./cs.component.html",
  styleUrls: ["./cs.component.css"],
})
export class CodingStationComponent {
  async register() {
    try {
      await AbrevvaCodingStation.register({
        url: "",
        clientId: "",
        username: "",
        password: "",
      });
      console.log(`register(): done`);
    } catch (e) {
      console.log(`register(): failed to authenticate: ${e}`);
    }
  }

  async connect() {
    try {
      await AbrevvaCodingStation.connect();
      console.log(`connect(): done`);
    } catch (e) {
      console.log(`connect(): failed to connect: ${e}`);
    }
  }

  async disconnect() {
    await AbrevvaCodingStation.disconnect();
    console.log(`disconnect(): done`);
  }

  async write() {
    try {
      await AbrevvaCodingStation.write();
      console.log("write(): done");
    } catch (e) {
      console.log(`write(): failed to write medium: ${e}`);
    }
  }
}
