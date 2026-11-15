import { Component, HostListener, OnInit, OnDestroy, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { forkJoin, Subscription } from 'rxjs';
import { ImageserviceService } from '../imageservice.service';
import { CARDS, GALLERY, IMAGELST, TILES } from '../Model/interface';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  standalone: false,
})
export class GalleryComponent implements OnInit, OnDestroy {
  cardsimgList: CARDS[] = [];
  carouselImgList: GALLERY[] = [];
  imageList: IMAGELST[] = [];
  tilesImgList: TILES[] = [];
  isLoading = signal(true);

  topBackgroundImages: string[] = environment.IMAGES.CAROUSEL;
  instagramUrl = environment.INSTAGRAM_URL;
  imgurl = environment.IMAGES.GALLERY_ME;

  loadedImages: Set<string> = new Set();
  private dataSub?: Subscription;

  constructor(
    private imgser: ImageserviceService,
    private title: Title,
    private dialog: MatDialog,
  ) {
    this.title.setTitle('Gallery | Ramanathan');
  }

  ngOnInit(): void {
    this.dataSub = forkJoin([
      this.imgser.getCarouselObs$(),
      this.imgser.getCardImgObs$(),
      this.imgser.getHomeObs$(),
      this.imgser.getImageObs$(),
      this.imgser.getTilesObs$(),
    ]).subscribe({
      next: ([carousel, cards, home, images, tiles]) => {
        const favorites = this.imgser.getFavorites();
        this.carouselImgList = carousel;
        this.cardsimgList = cards.map((card) => {
          const isFav = favorites.has(card.url);
          return {
            ...card,
            color: isFav ? 'warn' : 'none',
            likeCnt: isFav ? (card.likeCnt || 0) + 1 : card.likeCnt || 0,
          };
        });
        if (home.length > 0) {
          this.topBackgroundImages = home.map((item) => item.url);
        }
        this.imageList = images;
        this.tilesImgList = tiles;
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  changeColor(url: string): void {
    const isNowFavorited = this.imgser.toggleFavorite(url);
    for (const item of this.cardsimgList) {
      if (item.url === url) {
        if (isNowFavorited) {
          item.likeCnt = (item.likeCnt || 0) + 1;
          item.color = 'warn';
          if (this.imgser.feedbackNotify) {
            this.imgser.openSnackBar('Thank you for valuable feedback...❤️');
            this.imgser.feedbackNotify = false;
          }
        } else {
          item.likeCnt = item.likeCnt > 0 ? item.likeCnt - 1 : 0;
          item.color = 'none';
        }
      }
    }
  }

  onImageLoad(key: string): void {
    this.loadedImages.add(key);
  }

  isImageLoaded(key: string): boolean {
    return this.loadedImages.has(key);
  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
  }

  viewPhoto(index = 0, images: { url: string }[] = this.cardsimgList): void {
    this.dialog.open(PhotoDialog, {
      data: {
        images,
        index,
      },
      panelClass: 'full-screen-dialog',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
    });
  }
}

@Component({
  selector: 'app-photo-dialog',
  template: `
    <div class="light-box-container">
      <div class="lightbox-overlay" (click)="close()"></div>

      <div class="lightbox-content">
        <button class="close-btn" (click)="close()">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>

        @if (data.images.length > 1) {
          <button class="nav-btn prev" (click)="prev()">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
        }

        <div class="image-wrapper">
          <img [src]="data.images[currentIndex].url" class="lightbox-img" alt="Enlarged view" />
        </div>

        @if (data.images.length > 1) {
          <button class="nav-btn next" (click)="next()">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        }

        <div class="lightbox-footer">
          <span class="index-indicator">{{ currentIndex + 1 }} / {{ data.images.length }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .light-box-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
      }
      .lightbox-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .lightbox-content {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 2rem;
      }
      .lightbox-img {
        max-width: 90vw;
        max-height: 85vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
        animation: zoomIn 0.3s ease-out;
      }
      @keyframes zoomIn {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
      .close-btn {
        position: absolute;
        top: 2rem;
        right: 2rem;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
        transition: background 0.3s;
      }
      .close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      .nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        width: 60px;
        height: 100px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 5;
        transition: background 0.3s;
      }
      .nav-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      .nav-btn.prev {
        left: 0;
        border-radius: 0 100px 100px 0;
      }
      .nav-btn.next {
        right: 0;
        border-radius: 100px 0 0 100px;
      }
      .nav-btn mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
      }
      .lightbox-footer {
        position: absolute;
        bottom: 2rem;
        color: rgba(255, 255, 255, 0.5);
        font-family: 'Outfit', sans-serif;
        font-size: 1rem;
        letter-spacing: 2px;
      }
    `,
  ],
  standalone: false,
})
export class PhotoDialog {
  currentIndex: number;

  constructor(
    public dialogRef: MatDialogRef<PhotoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { images: { url: string }[]; index: number },
  ) {
    this.currentIndex = data.index;
  }

  close(): void {
    this.dialogRef.close();
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.data.images.length;
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.data.images.length) % this.data.images.length;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
    if (event.key === 'Escape') this.close();
  }
}
