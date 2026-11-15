import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore/lite';
import { from, Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment.prod';
import { CARDS, GALLERY, HOME, IMAGELST, TILES } from './Model/interface';

const SESSION_CACHE_PREFIX = 'ram_port_cache_v1_';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const FAVORITES_STORAGE_KEY = 'ram_port_favorites_v1';

interface CachedPayload<T> {
  timestamp: number;
  data: T[];
}

export type FirestoreCollectionFetcher = <T>(
  collectionName: string,
  includeId: boolean,
) => Promise<T[]>;

export const FIRESTORE_FETCHER = new InjectionToken<FirestoreCollectionFetcher>(
  'FIRESTORE_FETCHER',
);

@Injectable({
  providedIn: 'root',
})
export class ImageserviceService {
  feedbackNotify = true;

  carouselImgList: GALLERY[] = [];
  cardsimgList: CARDS[] = [];
  homeImgList: HOME[] = [];
  imageList: IMAGELST[] = [];
  tilesImgList: TILES[] = [];

  private carousel$?: Observable<GALLERY[]>;
  private cards$?: Observable<CARDS[]>;
  private home$?: Observable<HOME[]>;
  private image$?: Observable<IMAGELST[]>;
  private tiles$?: Observable<TILES[]>;
  private bypassCacheOnReload = this.isPageReload();

  constructor(
    private _snackBar: MatSnackBar,
    @Optional() @Inject(FIRESTORE_FETCHER) private customFetcher?: FirestoreCollectionFetcher | null,
  ) {}

  /** Fetch gallery carousel items once per session (cached in memory + sessionStorage). */
  getCarouselObs$(): Observable<GALLERY[]> {
    if (!this.carousel$) {
      this.carousel$ = this.fetchOnceWithCache<GALLERY>('gallery', this.carouselImgList);
    }
    return this.carousel$;
  }

  /** Fetch gallery card items once per session (cached in memory + sessionStorage). */
  getCardImgObs$(): Observable<CARDS[]> {
    if (!this.cards$) {
      this.cards$ = this.fetchOnceWithCache<CARDS>('cards', this.cardsimgList, true);
    }
    return this.cards$;
  }

  /** Fetch home hero/carousel items once per session. */
  getHomeObs$(): Observable<HOME[]> {
    if (!this.home$) {
      this.home$ = this.fetchOnceWithCache<HOME>('home', this.homeImgList);
    }
    return this.home$;
  }

  /** Fetch gallery 'image' collection items once per session. */
  getImageObs$(): Observable<IMAGELST[]> {
    if (!this.image$) {
      this.image$ = this.fetchOnceWithCache<IMAGELST>('image', this.imageList);
    }
    return this.image$;
  }

  /** Fetch gallery 'tiles' collection items once per session. */
  getTilesObs$(): Observable<TILES[]> {
    if (!this.tiles$) {
      this.tiles$ = this.fetchOnceWithCache<TILES>('tiles', this.tilesImgList);
    }
    return this.tiles$;
  }

  /** Returns the set of image URLs favorited by the visitor in localStorage. */
  getFavorites(): Set<string> {
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!raw) {
        return new Set<string>();
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? new Set<string>(parsed) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  }

  /** Toggles a card image URL in localStorage and returns the new favorited state. */
  toggleFavorite(url: string): boolean {
    const favorites = this.getFavorites();
    const isNowFavorited = !favorites.has(url);
    if (isNowFavorited) {
      favorites.add(url);
    } else {
      favorites.delete(url);
    }
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favorites]));
    } catch {
      // Ignore storage quota / privacy mode errors
    }
    return isNowFavorited;
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message, '', {
      duration: 1000,
    });
  }

  private fetchOnceWithCache<T>(
    collectionName: string,
    targetList: T[],
    includeId = false,
  ): Observable<T[]> {
    const cached = this.bypassCacheOnReload ? null : this.readSessionCache<T>(collectionName);
    if (cached) {
      targetList.length = 0;
      targetList.push(...cached);
      return of(cached);
    }

    const fetcher = this.customFetcher ?? this.defaultFirestoreFetcher;

    // One-time REST read via firestore/lite avoids persistent WebSocket snapshot listeners.
    return from(fetcher<T>(collectionName, includeId)).pipe(
      tap((items) => {
        targetList.length = 0;
        targetList.push(...items);
        this.writeSessionCache(collectionName, items);
      }),
      catchError((error) => {
        console.error(`Error fetching ${collectionName}:`, error);
        return of([] as T[]);
      }),
      shareReplay(1),
    );
  }

  private defaultFirestoreFetcher: FirestoreCollectionFetcher = async <T>(
    collectionName: string,
    includeId: boolean,
  ): Promise<T[]> => {
    const app = getApps().length ? getApp() : initializeApp(environment.firebase);
    const db = getFirestore(app);
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map((doc) => {
      const data = doc.data() as T;
      return includeId ? ({ ...data, id: doc.id } as T) : data;
    });
  };

  private readSessionCache<T>(key: string): T[] | null {
    try {
      const raw = sessionStorage.getItem(SESSION_CACHE_PREFIX + key);
      if (!raw) {
        return null;
      }
      const payload = JSON.parse(raw) as CachedPayload<T>;
      if (!payload || !Array.isArray(payload.data)) {
        return null;
      }
      if (Date.now() - payload.timestamp > CACHE_TTL_MS) {
        sessionStorage.removeItem(SESSION_CACHE_PREFIX + key);
        return null;
      }
      return payload.data;
    } catch {
      return null;
    }
  }

  private writeSessionCache<T>(key: string, data: T[]): void {
    try {
      const payload: CachedPayload<T> = {
        timestamp: Date.now(),
        data,
      };
      sessionStorage.setItem(SESSION_CACHE_PREFIX + key, JSON.stringify(payload));
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }

  private isPageReload(): boolean {
    try {
      const nav = performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined;
      return nav?.type === 'reload';
    } catch {
      return false;
    }
  }
}
