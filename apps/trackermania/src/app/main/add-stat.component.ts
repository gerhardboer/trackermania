import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { TrackmaniaService } from '../services/trackmania.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MapNumberPipe } from './map-number.pipe';

@Component({
  selector: 'trm-add-stat',
  template: `
    <section class="dialog">
      <header>
        <span>Add time</span>
        <button class="header-button" (click)="closeDialog.emit()">X</button>
      </header>

      <section class="dialog__body">
        <div class="form-row">
          <label for="campaign">Campaign</label>
          <select
            [(ngModel)]="campaign"
            (ngModelChange)="getMaps($event)"
            id="campaign"
          >
            @for (campaign of campaigns$();track campaign) {
            <option [ngValue]="campaign">{{ campaign.name }}</option>
            }
          </select>
        </div>

        <div class="form-row">
          <label for="map">Map</label>
          <select [(ngModel)]="map" id="map">
            @for (map of maps$();track map) {
            <option [ngValue]="map">{{ map.name | trmMapNumber }}</option>
            }
          </select>
        </div>

        <div class="form-row time">
          <label for="time">Time</label>
          <div class="time-input">
            <input
              type="text"
              inputmode="numeric"
              pattern="\\d*"
              placeholder="h"
              [(ngModel)]="hh"
            />
            :
            <input
              type="text"
              inputmode="numeric"
              pattern="\\d*"
              placeholder="m"
              [(ngModel)]="mm"
            />
            :
            <input
              type="text"
              inputmode="numeric"
              pattern="\\d*"
              placeholder="s"
              [(ngModel)]="ss"
            />
            .
            <input
              type="text"
              inputmode="numeric"
              pattern="\\d*"
              placeholder="ms"
              [(ngModel)]="SSS"
            />
          </div>
        </div>
      </section>

      <button (click)="saveTime()">Add</button>
    </section>
  `,
  standalone: true,
  imports: [FormsModule, MapNumberPipe],
  styleUrl: './add-stat.component.scss',
})
export class AddStatComponent {
  @Output() closeDialog = new EventEmitter<void>();
  @Output() newStat = new EventEmitter<{
    campaign: any;
    map: any;
    time: {
      h: number;
      mm: number;
      ss: number;
      SSS: number;
    };
  }>();

  trackmaniaService = inject(TrackmaniaService);

  campaigns$ = toSignal(this.trackmaniaService.getCampaigns());
  maps$ = signal<any[]>([]);

  map: any;
  campaign: any;

  hh = '';
  mm = '';
  ss = '';
  SSS = '';

  getMaps($event) {
    this.maps$.set([]);
    this.trackmaniaService.getCampaign($event.id).subscribe((campaign) => {
      this.maps$.set(campaign.maps);
    });
  }

  saveTime() {
    if (
      this.campaign &&
      this.map &&
      (this.hh || this.mm || this.ss || this.SSS)
    ) {
      this.newStat.emit({
        campaign: this.campaign,
        map: this.map,
        time: {
          h: this.hh ? parseInt(this.hh) : 0,
          mm: this.mm ? parseInt(this.mm) : 0,
          ss: this.ss ? parseInt(this.ss) : 0,
          SSS: this.SSS ? parseInt(this.SSS) : 0,
        },
      });

      this.map = null;
      this.campaign = null;
      this.hh = '';
      this.mm = '';
      this.ss = '';
      this.SSS = '';
    }
  }
}
