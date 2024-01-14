import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { TrackmaniaService } from '../../services/trackmania.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MapNumberPipe } from '../../shared/utils/map-number.pipe';
import { Campaign, Time, Track } from '../../types';
import { LoadingComponent } from '../loading.component';

@Component({
  selector: 'trm-stat-dialog',
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
          <label for="track">Map</label>

          <div class="loading">
            @if(loadingTracks$()) {
            <trm-loading />
            } @if (track) {
            {{ track.name | trmMapNumber }}
            } @else {
            <select [(ngModel)]="selectedTrack" id="track">
              @for (selectedTrack of tracks$(); track selectedTrack) {
              <option [ngValue]="selectedTrack">
                {{ selectedTrack.name | trmMapNumber }}
              </option>
              }
            </select>
            }
          </div>
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

        @if (campaign && track && track.time) {
        <button class="button" (click)="clearTime()">clear</button>
        }
        <button class="button" (click)="saveTime()">Save</button>
      </section>
    </section>
  `,
  standalone: true,
  imports: [FormsModule, MapNumberPipe, LoadingComponent],
  styleUrl: './stat-dialog.component.scss',
})
export class StatDialogComponent {
  @Input() campaign: Campaign | undefined;
  @Input() track: Track | undefined;

  @Output() closeDialog = new EventEmitter<void>();
  @Output() saveStat = new EventEmitter<{
    campaign: Campaign;
    track: Track;
    time: Time | undefined;
  }>();

  trackmaniaService = inject(TrackmaniaService);

  campaigns$ = toSignal(this.trackmaniaService.getCampaigns());
  tracks$ = signal<Track[]>([]);
  loadingTracks$ = signal<boolean>(false);

  selectedCampaign: Campaign | null = null;

  selectedTrack: Track | null = null;
  hh = '';
  mm = '';
  ss = '';
  SSS = '';

  ngOnChanges() {
    if (this.campaign) {
      this.selectedCampaign = this.campaign;

      if (!this.track) {
        this.getTracks(this.selectedCampaign);
      }
    }

    if (this.track?.time) {
      this.hh = this.track?.time.h.toString();
      this.mm = this.track?.time.mm.toString();
      this.ss = this.track?.time.ss.toString();
      this.SSS = this.track?.time.SSS.toString();
    }
  }

  getTracks($event: Campaign) {
    this.tracks$.set([]);
    this.loadingTracks$.set(true);
    this.trackmaniaService
      .getCampaign($event.seasonUid)
      .subscribe((campaign) => {
        this.tracks$.set(campaign.tracks);
        this.loadingTracks$.set(false);
      });
  }

  saveTime() {
    const campaign = this.campaign ?? this.selectedCampaign;
    const track = this.track ?? this.selectedTrack;
    const hasTime = this.hh || this.mm || this.ss || this.SSS;

    if (campaign && track && hasTime) {
      this.saveStat.emit({
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

  clearTime() {
    if (this.campaign && this.track) {
      this.saveStat.emit({
        campaign: this.campaign,
        track: this.track,
        time: undefined,
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
