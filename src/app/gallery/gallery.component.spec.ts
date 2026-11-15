import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ImageserviceService } from '../imageservice.service';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  let mockImageService: {
    feedbackNotify: boolean;
    getCarouselObs$: ReturnType<typeof vi.fn>;
    getCardImgObs$: ReturnType<typeof vi.fn>;
    getHomeObs$: ReturnType<typeof vi.fn>;
    getImageObs$: ReturnType<typeof vi.fn>;
    getTilesObs$: ReturnType<typeof vi.fn>;
    getFavorites: ReturnType<typeof vi.fn>;
    toggleFavorite: ReturnType<typeof vi.fn>;
    getMobileOperatingSystem: ReturnType<typeof vi.fn>;
    openSnackBar: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockImageService = {
      feedbackNotify: true,
      getCarouselObs$: vi.fn().mockReturnValue(of([{ url: 'https://example.com/c1.jpg' }])),
      getCardImgObs$: vi.fn().mockReturnValue(
        of([
          {
            id: 'ca_img1',
            url: 'https://example.com/card1.jpg',
            likeCnt: 4,
            des: 'Yercard',
            color: 'none',
          },
        ]),
      ),
      getHomeObs$: vi.fn().mockReturnValue(of([{ url: 'https://example.com/h1.jpg' }])),
      getImageObs$: vi.fn().mockReturnValue(of([{ url: 'https://example.com/i1.jpg' }])),
      getTilesObs$: vi.fn().mockReturnValue(of([{ url: 'https://example.com/t1.jpg' }])),
      getFavorites: vi.fn().mockReturnValue(new Set<string>()),
      toggleFavorite: vi.fn().mockReturnValue(true),
      getMobileOperatingSystem: vi.fn().mockReturnValue('WIN'),
      openSnackBar: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [GalleryComponent],
      providers: [{ provide: ImageserviceService, useValue: mockImageService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and lazily load all 5 gallery collections', () => {
    expect(component).toBeTruthy();
    expect(mockImageService.getCarouselObs$).toHaveBeenCalledTimes(1);
    expect(mockImageService.getCardImgObs$).toHaveBeenCalledTimes(1);
    expect(mockImageService.getHomeObs$).toHaveBeenCalledTimes(1);
    expect(mockImageService.getImageObs$).toHaveBeenCalledTimes(1);
    expect(mockImageService.getTilesObs$).toHaveBeenCalledTimes(1);
    expect(component.carouselImgList.length).toBe(1);
    expect(component.cardsimgList.length).toBe(1);
    expect(component.topBackgroundImages).toEqual(['https://example.com/h1.jpg']);
    expect(component.imageList.length).toBe(1);
    expect(component.tilesImgList.length).toBe(1);
    expect(component.isLoading()).toBe(false);
  });

  it('should toggle favorite state locally without Firestore writes', () => {
    component.changeColor('https://example.com/card1.jpg');
    expect(mockImageService.toggleFavorite).toHaveBeenCalledWith('https://example.com/card1.jpg');
    expect(component.cardsimgList[0].color).toBe('warn');
    expect(component.cardsimgList[0].likeCnt).toBe(5);
  });
});
