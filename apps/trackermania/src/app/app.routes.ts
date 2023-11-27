import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./login.component').then((m) => m.LoginComponent),
  },

  {
    path: 'game-session',
    loadComponent: () =>
      import('./main/game-session.component').then(
        (m) => m.GameSessionComponent
      ),
  },
  {
    path: 'tierlist',
    loadComponent: () =>
      import('./main/main.component').then((m) => m.MainComponent),
  },
];
