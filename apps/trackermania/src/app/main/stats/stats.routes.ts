import { Route } from '@angular/router';
import { StatsComponent } from './stats.component';
import { StatsCampaignsComponent } from './stats-campaigns.component';
import { StatsTracksComponent } from './stats-tracks.component';

export const statsRoutes: Route[] = [
  {
    path: '',
    component: StatsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: StatsCampaignsComponent,
      },
      {
        path: 'campaign/:campaignId',
        component: StatsTracksComponent,
      },
    ],
  },
];
