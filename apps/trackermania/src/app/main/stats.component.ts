import { Component, inject, WritableSignal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatManagementComponent } from './stat-management.component';
import { TimePipe } from './time.pipe';
import { MapNumberPipe } from './map-number.pipe';
import { Campaign, Track, Time } from '../types';
import { StorageApi } from '../storage.api';

@Component({
  selector: 'trm-stats',
  template: `
    <section class="content">
      <section class="content-title">
        <header>
          <span>Your stats</span>
          <button
            class="button header-button content-title__header-button"
            (click)="dialogElement.showModal()"
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
        @for (stat of stats$(); track stat) {
        <section class="stat-row">
          <header>
            {{ stat.name }}
          </header>
          @for (track of stat.tracks; track track) {
          <div
            class="stats-info"
            (click)="editStat(stat, track, dialogElement)"
          >
            <div class="stat-row__map-name">
              {{ track.name | trmMapNumber }}
            </div>

            <div class="stat-row__time">{{ track.time | time }}</div>
          </div>
          }
        </section>
        } @empty {
        <section class="stat-row">
          <span>No stats yet</span>
        </section>
        }
      </section>

      <dialog #dialogElement>
        <trm-stat-management
          [campaign]="selectedCampaign"
          [track]="selectedTrack"
          (newStat)="saveStat($event, dialogElement)"
          (closeDialog)="dialogElement.close()"
        ></trm-stat-management>
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
  ],
})
export class StatsComponent {
  stats$: WritableSignal<Campaign[]>;

  selectedCampaign: Campaign | undefined;
  selectedTrack: Track | undefined;

  private storage = inject(StorageApi);

  constructor() {
    this.stats$ = this.storage.getStats();
  }

  saveStat(
    newStat: {
      campaign: Campaign;
      track: Track;
      time: Time;
    },
    dialogElement: HTMLDialogElement
  ) {
    this.storage.saveStat(newStat);
    this.close(dialogElement);
  }

  close(dialogElement: HTMLDialogElement) {
    dialogElement.close();
    this.selectedCampaign = undefined;
    this.selectedTrack = undefined;
  }

  editStat(stat: Campaign, track: Track, dialogElement: HTMLDialogElement) {
    this.selectedCampaign = stat;
    this.selectedTrack = track;
    dialogElement.showModal();
  }
}
