import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'submit', pathMatch: 'full' },
  {
    path: 'submit',
    loadComponent: () =>
      import('./components/component-form/component-form.component').then(
        (m) => m.ComponentFormComponent
      ),
  },
  {
    path: 'browse',
    loadComponent: () =>
      import('./components/browse/browse.component').then(
        (m) => m.BrowseComponent
      ),
  },
];
