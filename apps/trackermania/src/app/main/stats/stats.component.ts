import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { StatDialogComponent } from './stat-dialog.component';
import { Campaign, Time, Track } from '../../types';
import { StatsApi } from '../../api/stats.api';
import { StatsControl } from './stats.control';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'trm-stats',
  template: `
    <section class="content">
      <section class="content-title">
        <header>
          <span>
            @if(statsControl.selectedCampaign()) {
            <button
              class="button header-button content-title__header-button back"
              (click)="goToCampaignSelect()"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            }
            <span>{{ title() }} </span>
          </span>

          <button
            class="button header-button content-title__header-button add-stat"
            (click)="addStat()"
          >
            <i class="fa-solid fa-plus"> </i>
            <i class="fa-solid fa-stopwatch"></i>
          </button>
        </header>
      </section>
      <section class="content-body">
        <router-outlet></router-outlet>
      </section>
      <dialog #dialogElement>
        @if(dialogElement.open) {
        <trm-stat-dialog
          [campaign]="statsControl.selectedCampaign()"
          [track]="statsControl.selectedTrack()"
          (saveStat)="saveStat($event)"
          (closeDialog)="dialogElement.close()"
        ></trm-stat-dialog>
        }
      </dialog>
    </section>
  `,
  standalone: true,
  styleUrl: './stats.component.scss',
  imports: [StatDialogComponent, RouterOutlet],
  providers: [StatsControl],
})
export class StatsComponent {
  @ViewChild('dialogElement')
  dialogElement!: ElementRef<HTMLDialogElement>;

  private statsApi = inject(StatsApi);
  private router = inject(Router);

  statsControl = inject(StatsControl);

  title = computed(() => {
    const campaign = this.statsControl.selectedCampaign();
    if (campaign) {
      return campaign.name;
    }

    return 'Select campaign';
  });

  constructor() {
    effect(() => {
      const campaign = this.statsControl.selectedCampaign(),
        track = this.statsControl.selectedTrack();
      if (campaign && track) {
        this.editStat();
      }
    });
  }

  saveStat(newStat: {
    campaign: Campaign;
    track: Track;
    time: Time | undefined;
  }) {
    this.statsApi.saveStat(newStat);
    this.close();
  }

  close() {
    this.dialogElement.nativeElement.close();
    this.statsControl.selectedTrack.set(undefined);
  }

  editStat() {
    this.dialogElement.nativeElement.showModal();
  }

  addStat() {
    this.dialogElement.nativeElement.showModal();
  }

  goToCampaignSelect() {
    this.statsControl.selectedCampaign.set(undefined);
    this.statsControl.selectedTrack.set(undefined);
    this.router.navigate(['/stats']);
  }
}
