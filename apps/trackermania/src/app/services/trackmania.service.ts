import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrackmaniaService {
  private url = 'http://localhost:3000/';

  private httpClient = inject(HttpClient);

  getCampaign(): Observable<any> {
    return this.httpClient.get(this.url + 'campaign');
  }
}
