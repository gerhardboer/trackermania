import { Component, inject, Input, OnInit } from '@angular/core';
import { StatsControl } from './stats.control';
import { TracksComponent } from '../../shared/tracks.component';
import { TrackmaniaService } from '../../services/trackmania.service';
import { LoadingComponent } from '../loading.component';

@Component({
  selector: 'tm-stats-tracks',
  template: `
    @if (statsControl.selectedCampaign()) {
    <trm-tracks
      [campaign]="statsControl.selectedCampaign()!"
      (selectTrack)="statsControl.selectedTrack.set($event)"
    ></trm-tracks>
    } @else {
    <trm-loading />
    }
  `,

  standalone: true,
  imports: [TracksComponent, LoadingComponent],
})
export class StatsTracksComponent implements OnInit {
  @Input() campaignId!: string;

  statsControl = inject(StatsControl);

  private trackmaniaService = inject(TrackmaniaService);

  ngOnInit() {
    this.trackmaniaService
      .getCampaign(this.campaignId)
      .subscribe((campaign) => {
        this.statsControl.selectedCampaign.set(campaign);
      });
  }
}
