import { inject, Injectable, signal } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  onSnapshot,
  setDoc,
} from '@angular/fire/firestore';
import { Campaign, Time, TimeRegistration, Track } from '../types';
import { UserApi } from './user-api.service';

export type Stats = {
  [key: string]: {
    [key: string]: TimeRegistration[];
  };
};

@Injectable({
  providedIn: 'root',
})
export class StatsApi {
  private db = inject(Firestore);

  private userId = inject(UserApi).userId$();
  private statsCollection = collection(this.db, `stats`);

  stats$ = signal<Stats>({});

  constructor() {
    onSnapshot(doc(this.statsCollection, this.userId), (snapshot) => {
      const data = snapshot.data() as Stats;
      if (data) {
        this.stats$.set(data);
      }
    });
  }

  saveStat(stat: { campaign: Campaign; track: Track; time: Time | undefined }) {
    const timeInMillis =
      (stat.time?.h ?? 0) * 60 * 60 * 1000 +
      (stat.time?.mm ?? 0) * 60 * 1000 +
      (stat.time?.ss ?? 0) * 1000 +
      (stat.time?.SSS ?? 0);

    const newStat = {
      date: Date.now(),
      time: stat.time,
      timeInMillis,
    };

    const currentStats =
      this.stats$()[stat.campaign.seasonUid]?.[stat.track.uid];

    if (currentStats) {
      currentStats.push(newStat);
    }

    setDoc(
      doc(this.statsCollection, `${this.userId}`),
      {
        [stat.campaign.seasonUid]: {
          [stat.track.uid]: currentStats ?? [newStat],
        },
      },
      { merge: true }
    );
  }
}
