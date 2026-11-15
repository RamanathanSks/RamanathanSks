import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { FIRESTORE_FETCHER, FirestoreCollectionFetcher, ImageserviceService } from './imageservice.service';

describe('ImageserviceService', () => {
  let service: ImageserviceService;
  let mockFetcher: ReturnType<typeof vi.fn<FirestoreCollectionFetcher>>;

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();

    mockFetcher = vi.fn<FirestoreCollectionFetcher>().mockResolvedValue([
      {
        id: 'doc1',
        url: 'https://example.com/photo1.jpg',
        likeCnt: 3,
        des: 'Sample',
        color: 'none',
      },
    ]);

    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [{ provide: FIRESTORE_FETCHER, useValue: mockFetcher }],
    });
    service = TestBed.inject(ImageserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch cards once and serve subsequent calls from session cache', async () => {
    const firstResult = await firstValueFrom(service.getCardImgObs$());
    expect(firstResult.length).toBe(1);
    expect(firstResult[0].id).toBe('doc1');
    expect(mockFetcher).toHaveBeenCalledTimes(1);

    // A fresh service instance in the same session should reuse sessionStorage without calling Firestore
    const freshService = new ImageserviceService(
      TestBed.inject(MatSnackBar),
      mockFetcher as unknown as FirestoreCollectionFetcher,
    );
    const cachedResult = await firstValueFrom(freshService.getCardImgObs$());

    expect(cachedResult.length).toBe(1);
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it('should toggle favorites in localStorage without Firestore writes', () => {
    const url = 'https://example.com/photo1.jpg';
    expect(service.getFavorites().has(url)).toBe(false);

    const added = service.toggleFavorite(url);
    expect(added).toBe(true);
    expect(service.getFavorites().has(url)).toBe(true);

    const removed = service.toggleFavorite(url);
    expect(removed).toBe(false);
    expect(service.getFavorites().has(url)).toBe(false);
  });
});
