import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AbrevvaCrypto } from '@evva-sfw/abrevva-capacitor';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.css'],
})
export class CryptoComponent {
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) { }

  output = '';
  funcName = '';

  async generateKeyPair() {
    const keypair = await AbrevvaCrypto.generateKeyPair();
    this.funcName = 'generateKeyPair()';
    this.output = `PublicKey: ${keypair.publicKey}\nPrivateKey: ${keypair.privateKey}`;
    this.changeDetectorRef.detectChanges();
  }

  async random() {
    const num = await AbrevvaCrypto.random({ numBytes: 5 });
    this.funcName = 'random()';
    this.output = num.value;
    this.changeDetectorRef.detectChanges();
  }
}
