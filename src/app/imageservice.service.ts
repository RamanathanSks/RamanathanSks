import { Injectable } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Observable, of, from } from 'rxjs';
import { map, shareReplay, tap, catchError } from 'rxjs/operators';
import { CARDS, GALLERY } from './Model/interface';
import { TILES } from './Model/interface';
import { IMAGELST } from './Model/interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ImageserviceService {
  onFirstLoad: boolean = true;
  feedbackNotify: boolean = true;

  // Local data stores (kept for synchronous access compatibility)
  carouselImgList: GALLERY[] = [];
  tilesImgList: TILES[] = [];
  imageList: IMAGELST[] = [];
  cardsimgList: any[] = []; // Typed as any to include 'id' field

  // Observables
  private carousel$: Observable<boolean>;
  private tiles$: Observable<boolean>;
  private image$: Observable<boolean>;
  private cards$: Observable<boolean>;

  // Collections
  GalleryCol: AngularFirestoreCollection<GALLERY>;
  TilesCol: AngularFirestoreCollection<TILES>;
  ImageCol: AngularFirestoreCollection<IMAGELST>;
  CardsCol: AngularFirestoreCollection<CARDS>;

  constructor(private firedb: AngularFirestore, private _snackBar: MatSnackBar) {
    this.GalleryCol = this.firedb.collection<GALLERY>('gallery');
    this.TilesCol = this.firedb.collection<TILES>('tiles');
    this.ImageCol = this.firedb.collection<IMAGELST>('image');
    this.CardsCol = this.firedb.collection<CARDS>('cards');

    // Initialize cached streams
    this.carousel$ = this.initCollection(this.GalleryCol, this.carouselImgList);
    this.tiles$ = this.initCollection(this.TilesCol, this.tilesImgList);
    this.image$ = this.initCollection(this.ImageCol, this.imageList);
    
    // Cards collection with ID field for robust updates
    this.cards$ = this.CardsCol.valueChanges({ idField: 'id' }).pipe(
      tap((data: any[]) => {
        this.cardsimgList.length = 0;
        this.cardsimgList.push(...data);
      }),
      map(() => true),
      shareReplay(1),
      catchError(error => {
        console.error('Error fetching cards:', error);
        return of(false);
      })
    );
  }

  // Helper to create a cached observable that updates a local array
  private initCollection<T>(collection: AngularFirestoreCollection<T>, targetList: T[]): Observable<boolean> {
    return collection.valueChanges().pipe(
      tap((data: T[]) => {
        targetList.length = 0;
        targetList.push(...data);
      }),
      map(() => true),
      shareReplay(1),
      catchError(error => {
        console.error('Error fetching collection:', error);
        return of(false);
      })
    );
  }

  // --- Carousel Methods ---
  getCarouselObs$(): Observable<any> {
    return this.carousel$;
  }

  getCarousel(): GALLERY[] {
    return this.carouselImgList;
  }

  // --- Titles Methods ---
  getTitlesObs$(): Observable<any> {
    return this.tiles$;
  }

  getTitles(): TILES[] {
    return this.tilesImgList;
  }

  // --- Image Methods ---
  getImgageObs$(): Observable<any> {
    return this.image$;
  }

  getimgageLst(): IMAGELST[] {
    return this.imageList;
  }

  // --- Card Methods ---
  getCardImgObs$(): Observable<any> {
    return this.cards$;
  }

  getCardImg(): CARDS[] {
    return this.cardsimgList;
  }

  updateCardImgObs(cardList: CARDS[]): Observable<boolean> {
    const updatePromises: Promise<void>[] = [];

    // Iterate over the local list which contains the 'id' field
    this.cardsimgList.forEach((item: any) => {
      if (item.color === "warn") {
        const { id, ...data } = item;
        
        // Reset color to none
        item.color = "none";
        const updateData = { ...data, color: "none" };

        if (id) {
          updatePromises.push(this.CardsCol.doc(id).update(updateData));
        }
      }
    });

    if (updatePromises.length === 0) {
      return of(true);
    }

    return from(Promise.all(updatePromises)).pipe(
      map(() => true),
      catchError(err => {
        console.error("Error updating cards:", err);
        return of(false);
      })
    );
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 1000
    });
  }

  // --- Utils ---
  getMobileOperatingSystem() {
    var userAgent = navigator.vendor;
    if (/windows phone|window|android/i.test(navigator.userAgent)) {
      return "WIN";
    }
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return "iOS";
    }
    return "unknown";
  }

  getMobileorDeskyopSystem() {
    var userAgent = navigator.vendor;
    if (/windows|window|/i.test(navigator.userAgent)) {
      return "DESK";
    }
    if (/phone|android|iPad|iPhone/i.test(navigator.userAgent)) {
      return "PHN"
    }
    return "unknown";
  }
}
