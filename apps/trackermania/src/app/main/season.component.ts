import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TrackmaniaService } from '../services/trackmania.service';
import { SessionControl } from './session.control';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'trm-season',
  template: `
    <div class="campaigns content">
      <div class="content-bg"></div>
      @for (campaignsByYear of campaignsByYear();track campaignsByYear.year) {
      <div class="campaign-row">
        <div class="year-container">
          <div class="year">
            <div>{{ campaignsByYear.year }}</div>
          </div>
        </div>

        <div class="season-container">
          @for (season of campaignsByYear.seasons;track season) {

          <div class="season" (click)="selectCampaign(season.campaignId)">
            <img src="{{ season.image }}" alt="{{ season.name }}" />
            <span class="season-name">{{ season.name }}</span>
          </div>
          }
        </div>
      </div>
      }
    </div>
  `,
  standalone: true,
  styleUrl: './season.component.scss',
  imports: [JsonPipe],
})
export class SeasonComponent {
  trackmaniaService = inject(TrackmaniaService);
  session = inject(SessionControl);
  router = inject(Router);

  campaigns = toSignal(this.trackmaniaService.getCampaigns());

  campaignsByYear = computed(() => {
    const campaigns = this.campaigns();

    if (!campaigns) return [];

    return this.transformToCampaignsByYear(campaigns);
  });

  selectCampaign(campaignId: string) {
    this.trackmaniaService
      .getCampaign(campaignId)
      .subscribe((campaign: any) => {
        this.session.campaign.set(campaign);
        this.router.navigate(['/tier-list']);
      });
  }

  private transformToCampaignsByYear(campaigns) {
    // campaigns look like this: ['fall 2022, 'spring 2022', 'fall 2021', 'spring 2021']
    // i want to group them by year, so it looks like this:
    // { 2022: ['fall 2022', 'spring 2022'], 2021: ['fall 2021', 'spring 2021'] }
    const campaignsByYear: { year: number; seasons: any[] }[] = [];
    campaigns.forEach((campaign: any) => {
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
