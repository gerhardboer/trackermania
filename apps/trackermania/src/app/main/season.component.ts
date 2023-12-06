import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TrackmaniaService } from '../services/trackmania.service';
import { SessionControl } from './session.control';

@Component({
  selector: 'trm-season',
  template: `
    <div class="campaigns">
      @for (campaignsByYear of campaignsByYear(); track campaignsByYear.year) {
      <div class="campaign-row">
        <div class="year-container">
          <div class="year">
            <div>{{ campaignsByYear.year }}</div>
          </div>
        </div>

        @for (season of campaignsByYear.seasons; track season) {
        <div class="season-container">
          <div class="season" (click)="selectCampaign(season.campaignId)">
            {{ season.season }}
          </div>
        </div>
        }
      </div>
      }
    </div>
  `,
  standalone: true,
  styleUrl: './season.component.scss',
})
export class SeasonComponent {
  trackmaniaService = inject(TrackmaniaService);
  session = inject(SessionControl);

  campaigns = toSignal(this.trackmaniaService.getCampaigns());

  campaignsByYear = computed(() => {
    const campaigns = this.campaigns();

    if (!campaigns) return [];

    // campaigns look like this: ['fall 2022, 'spring 2022', 'fall 2021', 'spring 2021']
    // i want to group them by year, so it looks like this:
    // { 2022: ['fall 2022', 'spring 2022'], 2021: ['fall 2021', 'spring 2021'] }
    const campaignsByYear: { year: number; seasons: any[] }[] = [];
    campaigns.forEach((campaign: any) => {
      const [season, year] = campaign.name.split(' ');
      const existingCampaign = campaignsByYear.find(
        (campaign) => campaign.year === year
      );
      if (existingCampaign) {
        existingCampaign.seasons.push({ season, id: campaign.id });
      } else {
        campaignsByYear.push({
          year,
          seasons: [{ season, id: campaign.id }],
        });
      }
    });
    return campaignsByYear;
  });

  selectCampaign(campaignId: string) {
    this.trackmaniaService
      .getCampaign(campaignId)
      .subscribe((campaign: any) => {
        this.session.campaign.set(campaign);
      });
  }
}
