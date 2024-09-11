import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CryptoComponent } from './crypto/crypto.component';
import { BleComponent } from './ble/ble.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: async () =>
      (await import('./home/home.module')).HomePageModule,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'crypto',
    component: CryptoComponent
  },
  {
    path: 'ble',
    component: BleComponent 
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
