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
      const data = snapshot.data() as { stats: Campaign[] };
      if (data) {
        this.stats$.set(data.stats);
      }
    });
  }

  saveStat(stat: { campaign: Campaign; track: Track; time: Time | undefined }) {
    setDoc(
      doc(
        this.statsCollection,
        `${this.userId}/${stat.campaign.id}/${stat.track.id}`
      ),
      stat.time
    );
  }
}
