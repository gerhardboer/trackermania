import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Campaign } from '../types';

@Injectable({
  providedIn: 'root',
})
export class TrackmaniaService {
  private url = 'http://localhost:3000/';

  private httpClient = inject(HttpClient);

  getCampaign(id: number): Observable<Campaign> {
    return this.httpClient.get<Campaign>(this.url + 'campaign', {
      params: { id },
    });
  }

  getCampaigns(): Observable<Campaign[]> {
    return this.httpClient.get<Campaign[]>(this.url + 'campaigns').pipe(
      map((campaigns: Campaign[]) => {
        return campaigns.map((campaign: Campaign) => {
          const [season, year] = campaign.name.split(' ');
          return {
            ...campaign,
            season,
            year,
            image: `/assets/seasons/${season.toLowerCase()}.png`,
            maps: [],
          };
        });
      })
    );
  }
}
