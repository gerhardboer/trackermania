import { Route } from '@angular/router';
import { MainComponent } from './main.component';

export const mainRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'season',
      },
      {
        path: 'season',
        loadComponent: () =>
          import('./season.component').then((m) => m.SeasonComponent),
      },
      {
        path: 'game-session',
        loadComponent: () =>
          import('./game-session.component').then(
            (m) => m.GameSessionComponent
          ),
      },

      {
        path: 'tier-list',
        loadComponent: () =>
          import('./tier-list.component').then((m) => m.TierListComponent),
      },
    ],
  },
];
