import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { BleComponent } from "./ble/ble.component";
import { CryptoComponent } from "./crypto/crypto.component";
import { CodingStationComponent } from "./cs/cs.component";

const routes: Routes = [
  {
    path: "home",
    loadChildren: async () => (await import("./home/home.module")).HomePageModule,
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "crypto",
    component: CryptoComponent,
  },
  {
    path: "ble",
    component: BleComponent,
  },
  {
    path: "cs",
    component: CodingStationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
