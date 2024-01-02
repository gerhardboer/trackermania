import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  loggedIn = signal(false);

  constructor() {
    if (localStorage.getItem('user')) {
      this.loggedIn.set(true);
    }
  }

  login(username: string) {
    localStorage.setItem('user', username);
    this.loggedIn.set(true);
  }
}
