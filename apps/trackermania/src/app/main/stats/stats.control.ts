import { Injectable, signal } from '@angular/core';
import { Campaign, Track } from '../../types';

@Injectable()
export class StatsControl {
  selectedCampaign = signal<Campaign | undefined>(undefined);
  selectedTrack = signal<Track | undefined>(undefined);
}
