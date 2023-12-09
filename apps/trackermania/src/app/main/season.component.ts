import {
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TrackmaniaService } from '../services/trackmania.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'trm-season',
  template: `
    <section class="content">
      <section class="content-title">
        <h1>Track browser</h1>
        <div class="content-title__subtitle">select a track</div>
      </section>
      <section class="campaigns content-body">
        @for (campaignsByYear of campaignsByYear();track campaignsByYear.year) {
        <section class="campaign-row">
          <section class="year-container">
            <div class="year">
              <div>{{ campaignsByYear.year }}</div>
            </div>
          </section>

          <section class="season-container">
            @for (season of campaignsByYear.seasons;track season) {

            <div class="season" (click)="selectCampaign(season.campaignId)">
              <img src="{{ season.image }}" alt="{{ season.name }}" />
              <span class="season-name">{{ season.name }}</span>
            </div>
            }
          </section>
        </section>
        }
      </section>
    </section>
  `,
  standalone: true,
  styleUrl: './season.component.scss',
  imports: [JsonPipe],
})
export class SeasonComponent {
  @Output() campaignSelected = new EventEmitter<string>();

  trackmaniaService = inject(TrackmaniaService);

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
        this.campaignSelected.emit(campaign);
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
