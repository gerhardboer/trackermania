import { inject, Injectable, signal } from '@angular/core';
import { UserApi } from './api/user-api.service';
import { Auth, user } from '@angular/fire/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  loggedIn = signal(false);

  private userApi = inject(UserApi);
  private auth = inject(Auth);

  user$ = user(this.auth);

  constructor() {
    this.user$.subscribe({
      next: (user) => {
        user ? this.setUser(user.uid) : this.logout();
      },
    });
  }

  logout() {
    this.userApi.userId$.set('');
    this.loggedIn.set(false);
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
