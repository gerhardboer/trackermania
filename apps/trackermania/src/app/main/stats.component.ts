import { Component, inject, signal, WritableSignal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddStatComponent } from './add-stat.component';
import { TimePipe } from './time.pipe';
import { MapNumberPipe } from './map-number.pipe';
import { Campaign, Map, Time } from '../types';
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
          @for (map of stat.maps; track map) {
          <div class="stats-info">
            <div class="stat-row__map-name">
              {{ map.name | trmMapNumber }}
            </div>

            <div class="stat-row__time">{{ map.time | time }}</div>
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
        <trm-add-stat
          (newStat)="saveStat($event, dialogElement)"
          (closeDialog)="dialogElement.close()"
        ></trm-add-stat>
      </dialog>
    </section>
  `,
  standalone: true,
  styleUrl: './stats.component.scss',
  imports: [JsonPipe, FormsModule, AddStatComponent, TimePipe, MapNumberPipe],
})
export class StatsComponent {
  stats$: WritableSignal<Campaign[]>;

  private storage = inject(StorageApi);

  constructor() {
    this.stats$ = this.storage.getStats();
  }

  saveStat(
    newStat: {
      campaign: Campaign;
      map: Map;
      time: Time;
    },
    dialogElement: HTMLDialogElement
  ) {
    this.storage.saveStat(newStat);
    this.close(dialogElement);
  }

  close(dialogElement: HTMLDialogElement) {
    dialogElement.close();
  }
}
