import { Injectable, signal } from '@angular/core';
import { Campaign, Map, Time } from './types';

@Injectable({
  providedIn: 'root',
})
export class StorageApi {
  // wrapper for localstorage, for easy migration to BE

  stats$ = signal<Campaign[]>([]);

  storeUser(username: string) {
    localStorage.setItem('user', username);
  }

  getCurrentUser() {
    return localStorage.getItem('user');
  }

  getStats() {
    const stats = localStorage.getItem('stats');
    if (stats) {
      this.stats$.set(JSON.parse(stats));
    }

    return this.stats$;
  }

  saveStat(newStat: { campaign: Campaign; map: Map; time: Time }) {
    this.stats$.update((stats) => {
      const campaign = stats.find((stat) => stat.id === newStat.campaign.id);
      if (campaign) {
        const map = campaign.maps.find((map) => map.name === newStat.map.name);
        if (map) {
          map.time = newStat.time;
        } else {
          campaign.maps.push({
            ...newStat.map,
            time: newStat.time,
          });
        }
      } else {
        stats.push({
          ...newStat.campaign,
          maps: [
            {
              ...newStat.map,
              time: newStat.time,
            },
          ],
        });
      }

      return stats;
    });

    localStorage.setItem('stats', JSON.stringify(this.stats$()));
  }
}
