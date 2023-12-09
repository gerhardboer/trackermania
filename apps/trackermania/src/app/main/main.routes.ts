import { Route } from '@angular/router';

export const mainRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tier-list',
  },
  {
    path: 'season',
    loadComponent: () =>
      import('./season.component').then((m) => m.SeasonComponent),
  },
  {
    path: 'game-session',
    loadComponent: () =>
      import('./game-session.component').then((m) => m.GameSessionComponent),
  },

  {
    path: 'tier-list',
    loadComponent: () =>
      import('./tier-list.component').then((m) => m.TierListComponent),
  },
];
