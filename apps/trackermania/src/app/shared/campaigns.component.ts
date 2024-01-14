import {
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { TrackmaniaService } from '../services/trackmania.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Campaign } from '../types';
import { LoadingComponent } from '../main/loading.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'trm-campaigns',
  template: `
    @if (campaignsByYear()) {
    <section class="campaigns">
      @for (campaignsByYear of campaignsByYear(); track campaignsByYear.year) {
      <section class="campaign-row">
        <section class="year-container">
          <div class="year">
            <div>{{ campaignsByYear.year }}</div>
          </div>
        </section>

        <section class="season-container">
          @for (season of campaignsByYear.seasons; track season) {

          <div class="season" (click)="selectCampaign(season.seasonUid)">
            <img [ngSrc]="season.image" alt="{{ season.name }}" priority fill />
            <span class="season-name">{{ season.name }}</span>
          </div>
          }
        </section>
      </section>
      }
    </section>
    } @else {
    <trm-loading />
    }
  `,
  styleUrl: './campaigns.component.scss',
  standalone: true,
  imports: [LoadingComponent, NgOptimizedImage],
})
export class CampaignsComponent {
  @Output() campaignSelected = new EventEmitter<Campaign>();

  trackmaniaService = inject(TrackmaniaService);
  campaigns = toSignal(this.trackmaniaService.getCampaigns());

  campaignsByYear = computed<{ year: string; seasons: Campaign[] }[]>(() => {
    const campaigns = this.campaigns();
    if (!campaigns) return [];
    return this.transformToCampaignsByYear(campaigns);
  });

  selectCampaign(campaignId: string) {
    this.trackmaniaService
      .getCampaign(campaignId)
      .subscribe((campaign: Campaign) => {
        this.campaignSelected.emit(campaign);
      });
  }

  private transformToCampaignsByYear(
    campaigns
  ): { year: string; seasons: Campaign[] }[] {
    // campaigns look like this: ['fall 2022, 'spring 2022', 'fall 2021', 'spring 2021']
    // i want to group them by year, so it looks like this:
    // { 2022: ['fall 2022', 'spring 2022'], 2021: ['fall 2021', 'spring 2021'] }
    const campaignsByYear: { year: string; seasons: Campaign[] }[] = [];
    campaigns.forEach((campaign: Campaign) => {
      const existingCampaign = campaignsByYear.find(
        (campaignByYear) => campaignByYear.year === campaign.year
      );
      if (existingCampaign) {
        existingCampaign.seasons.push(campaign);
      } else {
        campaignsByYear.push({
          year: campaign.year,
          seasons: [campaign],
        });
      }
    });
    return campaignsByYear;
  }
}
