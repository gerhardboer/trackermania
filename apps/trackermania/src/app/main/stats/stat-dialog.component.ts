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
import { TimeControlDirective } from '../../shared/utils/time-control.directive';

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
              trmTimeControl
              type="text"
              inputmode="numeric"
              placeholder="hh.mm.ss.SSS"
              [(ngModel)]="time"
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
  imports: [FormsModule, MapNumberPipe, LoadingComponent, TimeControlDirective],
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
  time: Time | undefined;

  ngOnChanges() {
    if (this.campaign) {
      this.selectedCampaign = this.campaign;

      if (!this.track) {
        this.getTracks(this.selectedCampaign);
      }
    }

    if (this.track?.time) {
      this.time = this.track?.time;
    }
  }

  getTracks($event: Campaign) {
    this.tracks$.set([]);
    this.loadingTracks$.set(true);
    this.trackmaniaService
      .getCampaign($event.seasonUid)
      .subscribe((campaign) => {
        this.tracks$.set(campaign.tracks ?? []);
        this.loadingTracks$.set(false);
      });
  }

  saveTime() {
    const campaign = this.campaign ?? this.selectedCampaign;
    const track = this.track ?? this.selectedTrack;
    const hasTime = this.time;

    if (campaign && track && hasTime) {
      this.saveStat.emit({
        campaign,
        track,
        time: this.time,
      });

      this.selectedTrack = null;
      this.selectedCampaign = null;
      this.time = undefined;
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
      this.time = undefined;
    }
  }
}
