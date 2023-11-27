import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'tierlist',
    loadComponent: () =>
      import('./main/main.component').then((m) => m.MainComponent),
  },
];
