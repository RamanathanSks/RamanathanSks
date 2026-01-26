import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BottomSheet } from '../app.component';
import { Title } from '@angular/platform-browser';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: false,
})
export class AboutComponent implements OnInit {
  imgurl =
    'https://firebasestorage.googleapis.com/v0/b/ram-port.appspot.com/o/me.bw.jpeg?alt=media&token=82107549-f6a1-4383-8785-ade33a391c16';

  constructor(
    private title: Title,
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
  ) {
    this.title.setTitle('About | Ramanathan');
  }
  ngOnInit(): void {}
  Connect() {
    this._bottomSheet.open(BottomSheet);
  }
}
