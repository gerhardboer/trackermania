import { inject, Injectable, signal } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  onSnapshot,
  setDoc,
} from '@angular/fire/firestore';
import { Campaign, Time, Track } from '../types';
import { UserApi } from './user-api.service';

@Injectable({
  providedIn: 'root',
})
export class StatsApi {
  private db = inject(Firestore);

  private userId = inject(UserApi).userId$();
  private statsCollection = collection(this.db, `stats`);

  stats$ = signal<Campaign[]>([]);

  constructor() {
    onSnapshot(doc(this.statsCollection, this.userId), (snapshot) => {
      const data = snapshot.data() as { campaigns: Campaign[] };
      if (data) {
        this.stats$.set(data.campaigns);
      }
    });
  }

  saveStat(stat: { campaign: Campaign; track: Track; time: Time | undefined }) {
    const currentStats = this.stats$();
    const campaign = currentStats.find(
      (currentStat) => currentStat.id === stat.campaign.id
    );
    if (campaign) {
      const track = campaign.tracks.find((map) => map.name === stat.track.name);
      if (track) {
        if (stat.time) {
          track.time = stat.time;
        } else {
          delete track.time;
        }
      } else {
        campaign.tracks.push({
          ...stat.track,
          time: stat.time,
        });
      }
    } else {
      currentStats.push({
        ...stat.campaign,
        tracks: [
          {
            ...stat.track,
            time: stat.time,
          },
        ],
      });
    }

    setDoc(doc(this.statsCollection, this.userId), {
      campaigns: currentStats,
    });
  }
}
