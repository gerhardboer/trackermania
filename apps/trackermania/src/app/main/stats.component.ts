import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddStatComponent } from './add-stat.component';
import { TimePipe } from './time.pipe';
import { MapNumberPipe } from './map-number.pipe';
import { Campaign, Map, Time } from '../types';

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
        <!--        color dot - map name - season  small font -->
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
        }
      </section>
    </section>

    <dialog #dialogElement>
      <trm-add-stat
        (newStat)="saveStat($event, dialogElement)"
        (closeDialog)="dialogElement.close()"
      ></trm-add-stat>
    </dialog>
  `,
  standalone: true,
  styleUrl: './stats.component.scss',
  imports: [JsonPipe, FormsModule, AddStatComponent, TimePipe, MapNumberPipe],
})
export class StatsComponent {
  stats$ = signal<Campaign[]>([]);

  constructor() {
    this.stats$.set([
      {
        name: 'Spring 2023',
        id: 38563,
        image: '/assets/seasons/spring.png',
        season: 'Spring',
        year: '2023',
        maps: [
          {
            name: 'Spring 2023 - 04',
            author: 'Nadeo',
            url: 'https://core.trackmania.nadeo.live/storageObjects/7feb0c6c-bbc5-4fc8-b5b4-713b423de1f9',
            thumbnail:
              'https://core.trackmania.nadeo.live/storageObjects/b1f77f37-e855-4e12-a3bd-13731c3163e8.jpg',
            uploaded: '2023-03-23T11:12:13.000Z',
            storageId: 'b1f77f37-e855-4e12-a3bd-13731c3163e8',
            uid: 'GYC5gFrd3TvWuyHRWe37ManmC76',
            fileName: 'Spring 2023 - 04.Map.Gbx',
            submitterName: 'Nadeo',
            time: {
              h: 1,
              mm: 1,
              ss: 1,
              SSS: 1,
            },
          },
          {
            name: 'Spring 2023 - 04',
            author: 'Nadeo',
            url: 'https://core.trackmania.nadeo.live/storageObjects/7feb0c6c-bbc5-4fc8-b5b4-713b423de1f9',
            thumbnail:
              'https://core.trackmania.nadeo.live/storageObjects/b1f77f37-e855-4e12-a3bd-13731c3163e8.jpg',
            uploaded: '2023-03-23T11:12:13.000Z',
            storageId: 'b1f77f37-e855-4e12-a3bd-13731c3163e8',
            uid: 'GYC5gFrd3TvWuyHRWe37ManmC76',
            fileName: 'Spring 2023 - 04.Map.Gbx',
            submitterName: 'Nadeo',
            time: {
              h: 1,
              mm: 1,
              ss: 1,
              SSS: 1,
            },
          },
        ],
      },
    ]);
  }

  saveStat(
    newStat: {
      campaign: Campaign;
      map: Map;
      time: Time;
    },
    dialogElement: HTMLDialogElement
  ) {
    this.stats$.update((stats) => {
      const campaign = stats.find((stat) => stat.id === newStat.campaign.id);
      if (campaign) {
        const map = campaign.maps.find((map) => map.name === newStat.map.name);
        if (map) {
          map.time = newStat.time;
        } else {
          campaign.maps.push({
            ...newStat.map,
            time: newStat.time,
          });
        }
      } else {
        stats.push({
          ...newStat.campaign,
          maps: [
            {
              ...newStat.map,
              time: newStat.time,
            },
          ],
        });
      }

      return stats;
    });

    this.close(dialogElement);
  }

  close(dialogElement: HTMLDialogElement) {
    dialogElement.close();
  }
}
