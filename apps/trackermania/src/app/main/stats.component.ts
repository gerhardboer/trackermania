import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatManagementComponent } from './stat-management.component';
import { TimePipe } from './time.pipe';
import { MapNumberPipe } from './map-number.pipe';
import { Campaign, Time, Track } from '../types';
import { CampaignsComponent } from '../shared/campaigns.component';
import { TracksComponent } from '../shared/tracks.component';
import { StatsApi } from '../api/stats.api';

@Component({
  selector: 'trm-stats',
  template: `
    <section class="content">
      <section class="content-title">
        <header>
          <span>
            @if(selectedCampaign()) {
            <button
              class="button header-button content-title__header-button back"
              (click)="
                selectedCampaign.set(undefined); selectedTrack.set(undefined)
              "
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            }
            <span>{{ title() }} </span>
          </span>

          <button
            class="button header-button content-title__header-button add-stat"
            (click)="addStat()"
          >
            <i class="fa-solid fa-plus"> </i>
            <i class="fa-solid fa-stopwatch"></i>
          </button>
        </header>
      </section>
      <section class="content-body">
        @if(selectedCampaign(); as campaign) {
        <trm-tracks
          [campaign]="campaign"
          (selectTrack)="editStat($event)"
        ></trm-tracks>
        } @else {
        <trm-campaigns
          (campaignSelected)="selectedCampaign.set($event)"
        ></trm-campaigns>
        }
      </section>
      <dialog #dialogElement>
        @if(dialogElement.open) {
        <trm-stat-management
          [campaign]="selectedCampaign()"
          [track]="selectedTrack()"
          (saveStat)="saveStat($event)"
          (closeDialog)="dialogElement.close()"
        ></trm-stat-management>
        }
      </dialog>
    </section>
  `,
  standalone: true,
  styleUrl: './stats.component.scss',
  imports: [
    JsonPipe,
    FormsModule,
    StatManagementComponent,
    TimePipe,
    MapNumberPipe,
    CampaignsComponent,
    TracksComponent,
  ],
})
export class StatsComponent {
  selectedCampaign = signal<Campaign | undefined>(undefined);
  selectedTrack = signal<Track | undefined>(undefined);

  @ViewChild('dialogElement')
  dialogElement!: ElementRef<HTMLDialogElement>;

  private stats = inject(StatsApi);

  title = computed(() => {
    const campaign = this.selectedCampaign();
    if (campaign) {
      return campaign.name;
    }

    return 'Select campaign';
  });

  constructor() {}

  saveStat(newStat: {
    campaign: Campaign;
    track: Track;
    time: Time | undefined;
  }) {
    this.stats.saveStat(newStat);
    this.close();
  }

  close() {
    this.dialogElement.nativeElement.close();
  }

  editStat(track: Track) {
    this.selectedTrack.set(track);
    this.dialogElement.nativeElement.showModal();
  }

  addStat() {
    this.dialogElement.nativeElement.showModal();
  }
}
