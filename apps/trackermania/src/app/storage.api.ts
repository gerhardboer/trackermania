import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageApi {
  // wrapper for localstorage, for easy migration to BE

  storeUser(username: string) {
    localStorage.setItem('user', username);
  }

  getCurrentUser() {
    return localStorage.getItem('user');
  }
}
