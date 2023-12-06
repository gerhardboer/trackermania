import { Injectable, signal } from '@angular/core';

@Injectable()
export class SessionControl {
  campaign = signal<any>(undefined);
}
