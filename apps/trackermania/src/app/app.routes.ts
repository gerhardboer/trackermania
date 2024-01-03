import { Route, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserApi } from './api/user-api.service';

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
        const storage = inject(UserApi);

        const hasUser = storage.userId$();
        if (!hasUser) {
          return router.navigate(['/login']);
        }

        return true;
      },
    ],
    loadChildren: () => import('./main/main.routes').then((m) => m.mainRoutes),
  },
];
