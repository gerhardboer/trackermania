import { Component, inject } from '@angular/core';
import { TrackmaniaService } from '../services/trackmania.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'trm-game-session',
  template: ` <div class="game-session">
    <!--      select players -->

    <!--      select campaign -->
    <select>
      @for (campaign of campaigns(); track campaign) {
      <option [value]="campaign">{{ campaign.name }}</option>
      }
    </select>
    <!--      select tracks -->

    <!--      go button-->
  </div>`,
  standalone: true,
})
export class GameSessionComponent {
  trackmaniaService = inject(TrackmaniaService);

  campaigns = toSignal(this.trackmaniaService.getCampaigns());
}
