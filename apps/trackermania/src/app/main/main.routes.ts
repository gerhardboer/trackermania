import { Route } from '@angular/router';

export const mainRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tier-list',
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('./times.component').then((m) => m.TimesComponent),
  },
  {
    path: 'players',
    loadComponent: () =>
      import('./profiles.component').then((m) => m.ProfilesComponent),
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
