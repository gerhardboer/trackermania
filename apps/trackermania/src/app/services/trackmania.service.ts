import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Campaign, TrackmaniaIoCampaign } from '../types';

@Injectable({
  providedIn: 'root',
})
export class TrackmaniaService {
  private url = 'http://localhost:3000/';

  private httpClient = inject(HttpClient);

  getCampaign(id: string): Observable<Campaign> {
    return this.httpClient
      .get<TrackmaniaIoCampaign>(this.url + 'campaign', {
        params: { id },
      })
      .pipe(
        map((campaign: TrackmaniaIoCampaign) => {
          return {
            ...campaign,
            tracks: campaign.maps,
          };
        })
      );
  }

  getCampaigns(): Observable<Campaign[]> {
    return this.httpClient
      .get<TrackmaniaIoCampaign[]>(this.url + 'campaigns')
      .pipe(
        map((campaigns: TrackmaniaIoCampaign[]) => {
          return campaigns.map((campaign: TrackmaniaIoCampaign) => {
            const [season, year] = campaign.name.split(' ');
            return {
              ...campaign,
              season,
              year,
              image: `/assets/seasons/${season.toLowerCase()}.png`,
              tracks: campaign.maps,
            };
          });
        })
      );
  }
}
