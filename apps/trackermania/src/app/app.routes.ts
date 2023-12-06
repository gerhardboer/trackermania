import { Route, Router } from '@angular/router';
import { inject } from '@angular/core';
import { MainComponent } from './main/main.component';

export const appRoutes: Route[] = [
  {
    path: 'login',
    pathMatch: 'full',
    loadComponent: () =>
      import('./login.component').then((m) => m.LoginComponent),
  },

  {
    path: '',
    canActivate: [
      () => {
        const router = inject(Router);
        const hasUser = !!localStorage.getItem('user');
        if (!hasUser) {
          return router.navigate(['/login']);
        }

        return true;
      },
    ],
    loadChildren: () => import('./main/main.routes').then((m) => m.mainRoutes),
  },
];
