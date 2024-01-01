import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddStatComponent } from './add-stat.component';
import { TimePipe } from './time.pipe';

@Component({
  selector: 'trm-times',
  template: `
    <section class="content">
      <section class="content-title">
        <header>
          <span>Times</span>
          <button
            class="header-button content-title__header-button"
            (click)="dialogElement.showModal()"
          >
            +
          </button>
        </header>

        <!--        menu    -->
        <!--        times, sorted by latest added     -->
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
        @for (stat of times$(); track stat) {
        <div class="stat-row">
          <div class="stats-info">
            <div class="stat-row__image hidden-sm">
              <img src="{{ stat.map.thumbnail }}" alt="{{ stat.map.name }}" />
            </div>

            <div class="stat-row__color-dot"></div>
            <div class="stat-row__map-name">
              {{ stat.map.name }}
            </div>
          </div>
          <div class="stat-row__time">{{ stat.time | time }}</div>
        </div>
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
  styleUrl: './times.component.scss',
  imports: [JsonPipe, FormsModule, AddStatComponent, TimePipe],
})
export class TimesComponent {
  times$ = signal<any[]>([]);

  constructor() {
    this.times$.set([
      {
        campaign: {
          name: 'Spring 2023',
          id: 38563,
          image: '/assets/seasons/spring.png',
          season: 'Spring',
          year: '2023',
        },
        map: {
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
        },
        time: {
          h: 1,
          mm: 1,
          ss: 1,
          SSS: 1,
        },
      },
      {
        campaign: {
          name: 'Spring 2023',
          id: 38563,
          image: '/assets/seasons/spring.png',
          season: 'Spring',
          year: '2023',
        },
        map: {
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
        },
        time: {
          h: 1,
          mm: 1,
          ss: 1,
          SSS: 1,
        },
      },
    ]);
  }

  saveStat(
    nweStat: { campaign: any; map: any; time: string },
    dialogElement: HTMLDialogElement
  ) {
    this.times$.update((stats) => {
      return [...stats, nweStat];
    });

    this.close(dialogElement);
  }

  close(dialogElement: HTMLDialogElement) {
    dialogElement.close();
  }
}
