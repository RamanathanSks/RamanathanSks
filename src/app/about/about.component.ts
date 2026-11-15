import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BottomSheet } from '../app.component';
import { Title } from '@angular/platform-browser';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: false,
})
export class AboutComponent implements OnInit {
  imgurl = environment.IMAGES.GALLERY_ME;
  colorImgUrl = environment.IMAGES.GALLERY_ME_COLOR;
  showColor = false;

  constructor(
    private title: Title,
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
  ) {
    this.title.setTitle('About | Ramanathan');
  }

  ngOnInit(): void {}

  toggleColor(): void {
    this.showColor = !this.showColor;
  }

  Connect(): void {
    this._bottomSheet.open(BottomSheet);
  }
}
