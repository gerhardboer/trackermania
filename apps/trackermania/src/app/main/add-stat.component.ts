import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { TrackmaniaService } from '../services/trackmania.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MapNumberPipe } from './map-number.pipe';
import { Campaign, Time, Track } from '../types';

@Component({
  selector: 'trm-stat-management',
  template: `
    <section class="dialog__content">
      <header>
        <span>Set Time</span>
      </header>

      <section class="dialog__body">
        <div class="form-row">
          <label for="campaign">Campaign</label>

          @if (campaign) {
          {{ campaign.name }}
          } @else {
          <select
            [(ngModel)]="selectedCampaign"
            (ngModelChange)="getTracks($event)"
            id="campaign"
          >
            @for (selectableCampaign of campaigns$(); track selectableCampaign)
            {
            <option [ngValue]="selectableCampaign">
              {{ selectableCampaign.name }}
            </option>
            }
          </select>
          }
        </div>

        <div class="form-row">
          <label for="map">Map</label>

          @if (track) {
          {{ track.name | trmMapNumber }}
          } @else {
          <select [(ngModel)]="selectedTrack" id="map">
            @for (track of tracks$(); track track) {
            <option [ngValue]="track">{{ track.name | trmMapNumber }}</option>
            }
          </select>
          }
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

      <section class="dialog__footer">
        <button class="button" (click)="closeDialog.emit()">close</button>
        <button class="button" (click)="saveTime()">Save</button>
      </section>
    </section>
  `,
  standalone: true,
  imports: [FormsModule, MapNumberPipe],
  styleUrl: './add-stat.component.scss',
})
export class AddStatComponent {
  @Input() campaign: Campaign | undefined;
  @Input() track: Track | undefined;

  @Output() closeDialog = new EventEmitter<void>();
  @Output() newStat = new EventEmitter<{
    campaign: Campaign;
    track: Track;
    time: Time;
  }>();

  trackmaniaService = inject(TrackmaniaService);

  campaigns$ = toSignal(this.trackmaniaService.getCampaigns());
  tracks$ = signal<Track[]>([]);

  selectedCampaign: Campaign | null = null;
  selectedTrack: Track | null = null;

  hh = '';
  mm = '';
  ss = '';
  SSS = '';

  ngOnChanges() {
    if (this.track?.time) {
      this.hh = this.track?.time.h.toString();
      this.mm = this.track?.time.mm.toString();
      this.ss = this.track?.time.ss.toString();
      this.SSS = this.track?.time.SSS.toString();
    }
  }

  getTracks($event: Campaign) {
    this.tracks$.set([]);
    this.trackmaniaService.getCampaign($event.id).subscribe((campaign) => {
      this.tracks$.set(campaign.tracks);
    });
  }

  saveTime() {
    const campaign = this.campaign ?? this.selectedCampaign;
    const track = this.track ?? this.selectedTrack;
    const hasTime = this.hh || this.mm || this.ss || this.SSS;

    if (campaign && track && hasTime) {
      this.newStat.emit({
        campaign,
        track,
        time: {
          h: this.hh ? parseInt(this.hh) : 0,
          mm: this.mm ? parseInt(this.mm) : 0,
          ss: this.ss ? parseInt(this.ss) : 0,
          SSS: this.SSS ? parseInt(this.SSS) : 0,
        },
      });

      this.selectedTrack = null;
      this.selectedCampaign = null;
      this.hh = '';
      this.mm = '';
      this.ss = '';
      this.SSS = '';
    }
  }
}
