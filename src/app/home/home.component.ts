import { Component, OnInit, OnDestroy } from '@angular/core';
import { BottomSheet } from '../app.component';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { environment } from 'src/environments/environment.prod';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private _bottomSheet: MatBottomSheet,
    private title: Title,
  ) {
    this.title.setTitle('Home | Ramanathan');
  }
  imgurl = environment.IMAGES.PROFILE;
  resumeUrl = environment.RESUME_URL;
  ngOnDestroy(): void {
    // console.log("Home Component Destroyed")
  }
  ngOnInit(): void {
    // console.log("Home Component Destroyed")
  }
  isImageLoaded = false;
  loadedImg() {
    console.log('Image Loaded');
    this.isImageLoaded = true;
  }
  Connect() {
    this._bottomSheet.open(BottomSheet);
  }
}
