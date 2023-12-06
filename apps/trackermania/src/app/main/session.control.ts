import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionControl {
  campaign = signal<any>(undefined);
}
