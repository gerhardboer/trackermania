import { inject, Injectable, signal } from '@angular/core';
import { StorageApi } from './storage.api';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  loggedIn = signal(false);

  private storage = inject(StorageApi);

  constructor() {
    if (this.storage.getCurrentUser()) {
      this.loggedIn.set(true);
    }
  }

  login(username: string) {
    this.storage.storeUser(username);
    this.loggedIn.set(true);
  }
}
