import { inject, Injectable, signal } from '@angular/core';
import { UserApi } from './api/user-api.service';
import { Auth, user } from '@angular/fire/auth';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  loggedIn = signal(false);

  private userApi = inject(UserApi);
  private auth = inject(Auth);
  private router = inject(Router);

  user$ = user(this.auth);

  constructor() {
    this.user$.subscribe({
      next: (user) => {
        if (user) {
          this.setUser(user.uid);
        }
      },
    });
  }

  logout() {
    this.userApi.userId$.set('');
    this.loggedIn.set(false);
    signOut(this.auth);
    this.router.navigate(['/login']);
  }

  login() {
    signInWithPopup(this.auth, new GoogleAuthProvider())
      .then((result) => {
        const user = result.user;
        this.setUser(user.uid);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setUser(uid: string) {
    this.userApi.userId$.set(uid);
    this.loggedIn.set(true);
  }
}
