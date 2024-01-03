import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  userId$ = signal<string>('');
}
