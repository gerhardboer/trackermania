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
    path: 'season',
    loadComponent: () =>
      import('./main/season.component').then((m) => m.SeasonComponent),
  },
  {
    path: 'tier-list',
    loadComponent: () =>
      import('./main/tier-list.component').then((m) => m.TierListComponent),
  },
];
