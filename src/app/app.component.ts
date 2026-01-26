import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getWindow } from './window';
import { fromEvent, merge, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { signal } from '@angular/core';
import { ImageserviceService } from './imageservice.service';
import { Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatMenuTrigger } from '@angular/material/menu';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Ramanathan';
  name: string = '';
  isOpen = false;
  status: string = '';
  @Output() stateChange = new EventEmitter<string>();
  col = 'primary';
  durationInSeconds = 5;
  currentUrl: any;
  hide: boolean = true;

  loader = signal(false);
  color: ThemePalette = 'warn';
  mode: ProgressBarMode = 'indeterminate';
  githuburl: string;
  codeurl: string;
  issueurl: string;
  instagramurl: string;
  facebookurl: string;
  twitterurl: string;
  fhpixurl: string;
  nfturl: string;
  linkedinurl: string;
  DataSub!: Subscription;
  constructor(
    private imgser: ImageserviceService,
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    private route: Router,
    private _snackBar: MatSnackBar,
  ) {
    this.githuburl = environment.GITHUB_URL;
    this.codeurl = environment.CODE_URL;
    this.issueurl = environment.ISSUE_URL;
    this.instagramurl = environment.INSTAGRAM_URL;
    this.facebookurl = environment.FACEBOOK_URL;
    this.fhpixurl = environment.FHPIX_URL;
    this.twitterurl = environment.TWITTER_URL;
    this.nfturl = environment.NFT_URL;
    this.linkedinurl = environment.LINKEDIN_URL;
    if (this.imgser.onFirstLoad) {
      this.imgser.onFirstLoad = false;
    }
  }

  Connect() {
    this._bottomSheet.open(BottomSheet, {
      panelClass: 'custom-bottom-sheet',
    });
  }
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  openNFTmenu() {
    this.trigger.openMenu();
  }
  closeNFTmenu() {
    this.trigger.closeMenu();
  }
  OpenNFTSheet() {
    this._bottomSheet.open(BottomSheetNFT, {
      panelClass: 'custom-bottom-sheet',
    });
  }

  ngOnInit(): void {
    this.getAllData();

    const { onLine } = getWindow().navigator;
    this.status = onLine ? 'online' : 'offline';

    this.stateChange.emit(this.status);
    merge(fromEvent<Event>(getWindow(), 'online'), fromEvent<Event>(getWindow(), 'offline'))
      .pipe(map((x) => x.type))
      .subscribe((res) => {
        this.status = res;
        this.stateChange.emit(res);
        if (res == 'offline') {
          this.currentUrl = this.route.url;
          this.route.navigateByUrl('b2ZmbGluZQ');
        }
        if (res == 'online') this.route.navigateByUrl(this.currentUrl);
      });
  }

  ngOnDestroy(): void {
    if (this.DataSub) {
      this.DataSub.unsubscribe();
    }
  }
  getAllData() {
    this.DataSub = combineLatest([
      this.imgser.getCarouselObs$(),
      this.imgser.getTitlesObs$(),
      this.imgser.getImgageObs$(),
      this.imgser.getCardImgObs$(),
    ]).subscribe(([carousel, tiles, images, cards]) => {
      if (carousel && tiles && images && cards) {
        console.log('All data loaded');
        this.loader.set(true);
      }
    });
  }

  offsetFlag = true;
  @HostListener('window:scroll', ['$event'])
  getScrollHeight(event: any) {
    if (window.pageYOffset > 2500) this.offsetFlag = false;
    else this.offsetFlag = true;
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    this.openSnackBar('Disabled ⛔');
    event.preventDefault();
  }

  gotop() {
    window.scroll(0, 0);
  }

  openbarcode(): void {
    const bardialog = this.dialog.open(barcodeDialog, {
      width: 'auto',
      position: { bottom: '6%' },
    });

    bardialog.afterClosed().subscribe();
  }
  closebarcode(): void {
    this.dialog.closeAll();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 1000,
    });
  }
}

@Component({
  selector: 'barcode',
  templateUrl: './barcodeDialog.html',
  standalone: false,
})
export class barcodeDialog {
  instagramurl: string;
  barcodeImgUrl: string;
  constructor() {
    this.instagramurl = environment.INSTAGRAM_URL;
    this.barcodeImgUrl = environment.IMAGES.INSTA_BARCODE;
  }
}

//bottom sheet
@Component({
  selector: 'bottom-sheet',
  templateUrl: 'bottom-sheet.html',
  standalone: false,
})
export class BottomSheet {
  mailLink = 'mailto:ramanathan.sks@gmail.com';
  linkedinurl: string;
  constructor(
    private imgser: ImageserviceService,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheet>,
  ) {
    this.linkedinurl = environment.LINKEDIN_URL;
    var device = this.imgser.getMobileorDeskyopSystem();
  }
  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
  }
}

@Component({
  selector: 'bottom-sheet2',
  templateUrl: 'bottom-sheet2.html',
  standalone: false,
})
export class BottomSheetNFT {
  nfturl: string;
  constructor(private _bottomSheetRef2: MatBottomSheetRef<BottomSheet>) {
    this.nfturl = environment.NFT_URL;
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef2.dismiss();
    event.preventDefault();
  }
}
