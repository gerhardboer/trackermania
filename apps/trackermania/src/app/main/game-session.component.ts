import { Component, inject } from '@angular/core';
import { TrackmaniaService } from '../services/trackmania.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'trm-game-session',
  template: `
    <section class="content">
      <section class="content-title">
        <header>Player browser</header>
        <div class="content-title__subtitle">Who is playing?</div>
      </section>
      <section class="players content-body"></section>
    </section>

    <!--      select players -->

    <!--      select campaign -->
    <!--    <select>-->
    <!--      @for (campaign of campaigns(); track campaign) {-->
    <!--      <option [value]="campaign">{{ campaign.name }}</option>-->
    <!--      }-->
    <!--    </select>-->
    <!--      select tracks -->

    <!--      go button-->
  `,
  standalone: true,
  styleUrl: './game-session.component.scss',
})
export class GameSessionComponent {
  trackmaniaService = inject(TrackmaniaService);

  campaigns = toSignal(this.trackmaniaService.getCampaigns());
}
