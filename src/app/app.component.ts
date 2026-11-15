import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getWindow } from './window';
import { fromEvent, merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Ramanathan';
  status = '';
  @Output() stateChange = new EventEmitter<string>();
  currentUrl = '/';

  githuburl: string;
  codeurl: string;
  issueurl: string;
  instagramurl: string;
  facebookurl: string;
  twitterurl: string;
  fhpixurl: string;
  private connectivitySub?: Subscription;

  constructor(
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
  }

  Connect(): void {
    this._bottomSheet.open(BottomSheet, {
      panelClass: 'custom-bottom-sheet',
    });
  }

  ngOnInit(): void {
    const { onLine } = getWindow().navigator;
    this.status = onLine ? 'online' : 'offline';

    this.stateChange.emit(this.status);
    this.connectivitySub = merge(
      fromEvent<Event>(getWindow(), 'online'),
      fromEvent<Event>(getWindow(), 'offline'),
    )
      .pipe(map((x) => x.type))
      .subscribe((res) => {
        this.status = res;
        this.stateChange.emit(res);
        if (res === 'offline') {
          this.currentUrl = this.route.url || '/';
          this.route.navigateByUrl('b2ZmbGluZQ');
        }
        if (res === 'online') {
          this.route.navigateByUrl(this.currentUrl || '/');
        }
      });
  }

  ngOnDestroy(): void {
    this.connectivitySub?.unsubscribe();
  }

  offsetFlag = true;
  @HostListener('window:scroll')
  getScrollHeight(): void {
    if (window.pageYOffset > 2500) this.offsetFlag = false;
    else this.offsetFlag = true;
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: Event): void {
    this.openSnackBar('Disabled ⛔');
    event.preventDefault();
  }

  gotop(): void {
    window.scroll(0, 0);
  }

  openbarcode(): void {
    const bardialog = this.dialog.open(barcodeDialog, {
      width: 'auto',
      position: { bottom: '6%' },
    });

    bardialog.afterClosed().subscribe();
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message, '', {
      duration: 1000,
    });
  }
}

@Component({
  selector: 'barcode',
  templateUrl: './barcodeDialog.html',
  styles: [
    `
      .barcode-link {
        outline: none;
        display: block;
      }

      .barcode-link img {
        vertical-align: super;
        cursor: pointer;
      }

      .barcode-hint {
        text-align: center;
      }
    `,
  ],
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

@Component({
  selector: 'bottom-sheet',
  templateUrl: './bottom-sheet.html',
  styles: [
    `
      .bottom-sheet-container {
        background: #0d0d0d;
        color: white;
        padding: 24px 16px 16px;
        font-family: 'Outfit', sans-serif;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        border-top-left-radius: 38px;
        border-top-right-radius: 38px;
      }

      .header {
        margin-bottom: 16px;
        padding: 0 4px;
      }

      .title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
        color: #fff;
        letter-spacing: -0.5px;
      }

      .subtitle {
        font-size: 0.8rem;
        color: #888;
        margin-top: 2px;
        font-weight: 400;
      }

      .connect-item {
        display: block !important;
        height: auto !important;
        padding: 8px 12px !important;
        margin-bottom: 8px !important;
        border-radius: 12px !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
        transition: all 0.2s ease-in-out !important;
      }

      .connect-item:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        transform: scale(1.01);
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      .item-content {
        display: flex;
        align-items: center;
        width: 100%;
      }

      .icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 10px;
        margin-right: 12px;
        flex-shrink: 0;
      }

      .icon-container img {
        width: 20px;
        height: 20px;
      }

      .icon-container.mail {
        background: linear-gradient(135deg, #ef4444, #991b1b);
      }

      .icon-container.linkedin {
        background: linear-gradient(135deg, #0a66c2, #004182);
      }

      .text-content {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 2px;
      }

      .label {
        font-size: 0.95rem;
        font-weight: 600;
        color: #fff;
      }

      .description {
        font-size: 0.7rem;
        color: #666;
        font-weight: 400;
      }

      .chevron {
        color: #333;
        font-size: 18px;
        width: 18px;
        height: 18px;
        transition: all 0.2s ease;
      }

      .connect-item:hover .chevron {
        color: #888;
        transform: translateX(2px);
      }
    `,
  ],
  standalone: false,
})
export class BottomSheet {
  mailLink = 'mailto:ramanathan.sks@gmail.com';
  linkedinurl: string;
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheet>) {
    this.linkedinurl = environment.LINKEDIN_URL;
  }
  openLink(_event?: MouseEvent): void {
    this._bottomSheetRef.dismiss();
  }
}
