import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Campaign, Track } from '../types';
import { TimePipe } from './utils/time.pipe';
import { MapNumberPipe } from './utils/map-number.pipe';
import { StatsApi } from '../api/stats.api';
import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { FastestTimePipe } from './utils/fastest-time.pipe';

@Component({
  selector: 'trm-tracks',
  template: `
    <section class="tracks">
      @for (track of campaign.tracks; track track) {
      <div class="track" (click)="selectTrack.emit(track)">
        <div class="track__cover">
          <img
            [ngSrc]="track.thumbnailUrl"
            alt="{{ track.name }}"
            priority
            fill
          />
          <div class="track__name">{{ track.name | trmMapNumber }}</div>
        </div>

        <div class="track__time">
          <i class="fa-regular fa-clock"></i>
          {{ stats$()[campaign.seasonUid]?.[track.uid] | fastestTime | time }}
        </div>
      </div>
      }
    </section>
  `,
  styleUrl: './tracks.component.scss',
  standalone: true,
  imports: [
    TimePipe,
    MapNumberPipe,
    JsonPipe,
    FastestTimePipe,
    NgOptimizedImage,
  ],
})
export class TracksComponent {
  @Input({ required: true }) campaign!: Campaign;
  @Output() selectTrack = new EventEmitter<Track>();

  private stats = inject(StatsApi);

  stats$ = this.stats.stats$;

  constructor() {}
}
