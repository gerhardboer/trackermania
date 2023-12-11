import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { TrackmaniaService } from '../services/trackmania.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'trm-add-stat',
  template: `
    <section class="add-stat">
      <div class="add-stat__title">
        <h2>Add time</h2>
        <button class="close-button" (click)="closeDialog.emit()">X</button>
      </div>

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
          <option [ngValue]="map">{{ map.name }}</option>
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

      <button (click)="saveTime()" [disabled]="!campaign || !map">Add</button>
    </section>
  `,
  standalone: true,
  imports: [FormsModule],
  styleUrl: './add-stat.component.scss',
})
export class AddStatComponent {
  @Output() closeDialog = new EventEmitter<void>();
  @Output() newStat = new EventEmitter<{
    campaign: any;
    map: any;
    time: any;
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
    this.newStat.emit({
      campaign: this.campaign,
      map: this.map,
      time: {
        h: this.hh,
        mm: this.mm,
        ss: this.ss,
        SSS: this.SSS,
      },
    });
  }
}
