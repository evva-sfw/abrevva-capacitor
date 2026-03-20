import { Component, inject } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import { AbrevvaCrypto } from "@evva/abrevva-capacitor";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";

@Component({
  selector: "app-crypto",
  templateUrl: "./crypto.component.html",
  styleUrls: ["./crypto.component.css"],
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonText, IonButton],
})
export class CryptoComponent {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  output = "";
  funcName = "";

  async generateKeyPair() {
    const keypair = await AbrevvaCrypto.generateKeyPair();
    this.funcName = "generateKeyPair()";
    this.output = `PublicKey: ${keypair.publicKey}\nPrivateKey: ${keypair.privateKey}`;
    this.changeDetectorRef.detectChanges();
  }

  async random() {
    const num = await AbrevvaCrypto.random({ numBytes: 5 });
    this.funcName = "random()";
    this.output = num.value;
    this.changeDetectorRef.detectChanges();
  }
}
