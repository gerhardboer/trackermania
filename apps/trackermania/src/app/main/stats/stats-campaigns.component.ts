import { Component, inject } from '@angular/core';
import { StatsControl } from './stats.control';
import { CampaignsComponent } from '../../shared/campaigns.component';
import { StatDialogComponent } from './stat-dialog.component';
import { Campaign } from '../../types';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'tm-stats-campaigns',
  template: `
    <trm-campaigns (campaignSelected)="goToCampaign($event)"></trm-campaigns>
  `,
  standalone: true,
  imports: [CampaignsComponent, StatDialogComponent, RouterOutlet],
})
export class StatsCampaignsComponent {
  statsControl = inject(StatsControl);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  goToCampaign(campaign: Campaign) {
    this.statsControl.selectedCampaign.set(campaign);
    this.router.navigate(['./', 'campaign', campaign.seasonUid], {
      relativeTo: this.route,
    });
  }
}
