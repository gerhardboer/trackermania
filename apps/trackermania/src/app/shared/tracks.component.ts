import { Component, inject, Input } from '@angular/core';
import { TrackmaniaService } from '../services/trackmania.service';
import { Campaign } from '../types';
import { TimePipe } from '../main/time.pipe';

@Component({
  selector: 'trm-tracks',
  template: `
    <section class="tracks">
      @for (track of campaign.tracks; track track) {
      <div class="track">
        <img [src]="track.thumbnail" alt="{{ track.name }}" width="20%" />
        <div class="track__name">{{ track.name }}</div>
        <div class="track__time">{{ track.time | time }}</div>
      </div>
      }
    </section>
  `,
  styleUrl: './tracks.component.scss',
  standalone: true,
  imports: [TimePipe],
})
export class TracksComponent {
  @Input({ required: true }) campaign!: Campaign;

  trackmaniaService = inject(TrackmaniaService);
}
