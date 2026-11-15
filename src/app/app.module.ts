import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, BottomSheet, barcodeDialog } from './app.component';
import { HomeComponent } from './home/home.component';
import { GalleryComponent, PhotoDialog } from './gallery/gallery.component';
import { AboutComponent } from './about/about.component';
import {
  NotFoundComponentComponent,
  OfflineComponent,
} from './not-found-component/not-found-component.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    barcodeDialog,
    GalleryComponent,
    PhotoDialog,
    AboutComponent,
    NotFoundComponentComponent,
    OfflineComponent,
    BottomSheet,
  ],
  imports: [BrowserModule, MaterialModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
