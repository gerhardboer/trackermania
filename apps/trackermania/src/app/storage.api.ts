import { Injectable, signal } from '@angular/core';
import { Campaign, Track, Time } from './types';

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

  saveStat(newStat: { campaign: Campaign; track: Track; time: Time }) {
    this.stats$.update((stats) => {
      const campaign = stats.find((stat) => stat.id === newStat.campaign.id);
      if (campaign) {
        const track = campaign.tracks.find(
          (map) => map.name === newStat.track.name
        );
        if (track) {
          track.time = newStat.time;
        } else {
          campaign.tracks.push({
            ...newStat.track,
            time: newStat.time,
          });
        }
      } else {
        stats.push({
          ...newStat.campaign,
          tracks: [
            {
              ...newStat.track,
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
