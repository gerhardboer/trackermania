import { Component, EventEmitter, Output } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Campaign } from '../types';
import { CampaignsComponent } from '../shared/campaigns.component';

@Component({
  selector: 'trm-season',
  template: `
    <section class="content">
      <section class="content-title">
        <header>Track browser</header>
        <div class="content-title__subtitle">select a track</div>
      </section>
      <section class="content-body">
        <trm-campaigns
          (campaignSelected)="campaignSelected.emit($event)"
        ></trm-campaigns>
      </section>
    </section>
  `,
  standalone: true,
  styleUrl: './season.component.scss',
  imports: [JsonPipe, CampaignsComponent],
})
export class SeasonComponent {
  @Output() campaignSelected = new EventEmitter<Campaign>();
}
