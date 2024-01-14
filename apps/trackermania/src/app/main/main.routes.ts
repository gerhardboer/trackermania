import { Route } from '@angular/router';

export const mainRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'stats',
  },
  {
    path: 'stats',
    loadChildren: () =>
      import('./stats/stats.routes').then((m) => m.statsRoutes),
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
