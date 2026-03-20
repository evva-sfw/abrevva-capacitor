import { Component } from "@angular/core";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonList,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonButton, RouterLink],
})
export class HomePageComponent {}
