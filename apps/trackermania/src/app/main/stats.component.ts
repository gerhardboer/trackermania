import {
  Component,
  ElementRef,
  inject,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatManagementComponent } from './stat-management.component';
import { TimePipe } from './time.pipe';
import { MapNumberPipe } from './map-number.pipe';
import { Campaign, Time, Track } from '../types';
import { StatsApi } from '../api/stats.api';
import { CampaignsComponent } from '../shared/campaigns.component';

@Component({
  selector: 'trm-stats',
  template: `
    <section class="content">
      <section class="content-title">
        <header>
          <span>Your stats</span>
          <button
            class="button header-button content-title__header-button"
            (click)="addStat()"
          >
            +
          </button>
        </header>

        <!--        menu    -->
        <!--        stats, sorted by latest added     -->
        <!--        has some filters -->
        <!--        sort by in season map desc/asc -->
      </section>
      <section class="content-body">
        <!--        filter bar  -->
        <!--        add button-->

        <!--        stat row -->
        <!--        time: big       -->
        <!--        history? -->
        <trm-campaigns></trm-campaigns>
      </section>
      <dialog #dialogElement>
        @if(dialogElement.open) {
        <trm-stat-management
          [campaign]="selectedCampaign"
          [track]="selectedTrack"
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
  ],
})
export class StatsComponent {
  stats$: WritableSignal<Campaign[]>;

  selectedCampaign: Campaign | undefined;
  selectedTrack: Track | undefined;

  @ViewChild('dialogElement')
  dialogElement!: ElementRef<HTMLDialogElement>;

  private stats = inject(StatsApi);

  constructor() {
    this.stats$ = this.stats.stats$;
  }

  ngAfterViewInit() {
    this.dialogElement.nativeElement.addEventListener('close', () => {
      this.selectedCampaign = undefined;
      this.selectedTrack = undefined;
    });
  }

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

  editStat(stat: Campaign, track: Track) {
    this.selectedCampaign = stat;
    this.selectedTrack = track;
    this.dialogElement.nativeElement.showModal();
  }

  addStat() {
    this.dialogElement.nativeElement.showModal();
  }
}
