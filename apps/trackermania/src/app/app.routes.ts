import { Route, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticateService } from './authenticate.service';
import { map } from 'rxjs';

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
        const auth = inject(AuthenticateService);

        return auth.user$.pipe(
          map((user) => {
            if (!user) {
              return router.navigate(['/login']);
            }
            return true;
          })
        );
      },
    ],
    loadChildren: () => import('./main/main.routes').then((m) => m.mainRoutes),
  },
];
