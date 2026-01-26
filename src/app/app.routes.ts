import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { AboutComponent } from './about/about.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'Gallery',
    component: GalleryComponent,
  },
  {
    path: 'About',
    component: AboutComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
  { path: 'Home', redirectTo: '' },
  { path: 'Gallery', redirectTo: 'Gallery' },
];
