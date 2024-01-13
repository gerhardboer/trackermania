import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Campaign, Track } from '../types';
import { TimePipe } from '../main/time.pipe';
import { MapNumberPipe } from '../main/map-number.pipe';
import { StatsApi } from '../api/stats.api';
import { JsonPipe } from '@angular/common';
import { FastestTimePipe } from '../main/fastest-time.pipe';

@Component({
  selector: 'trm-tracks',
  template: `
    <section class="tracks">
      @for (track of campaign?.tracks; track track) {
      <div class="track" (click)="selectTrack.emit(track)">
        <div class="track__name">{{ track.name | trmMapNumber }}</div>
        <img [src]="track.thumbnail" alt="{{ track.name }}" />

        <div class="track__time">
          {{ stats$()[campaign.id]?.[track.id] | fastestTime | time }}
        </div>
      </div>
      }
    </section>
  `,
  styleUrl: './tracks.component.scss',
  standalone: true,
  imports: [TimePipe, MapNumberPipe, JsonPipe, FastestTimePipe],
})
export class TracksComponent {
  @Input({ required: true }) campaign!: Campaign;
  @Output() selectTrack = new EventEmitter<Track>();

  private stats = inject(StatsApi);

  stats$ = this.stats.stats$;

  constructor() {}
}
