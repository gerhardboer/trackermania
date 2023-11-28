import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tierColors, tierListDefinition } from './tier-list-definition';
import { TrackmaniaService } from '../services/trackmania.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

interface Tier {
  level: string;
  body: any[];
  backgroundColor?: string;
}

@Component({
  selector: 'trm-tier-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

    @if (campaign()) {
    <div class="tier-list">
      @for (tier of tierList();track tier.level) {
      <div class="tier-item">
        <div
          class="tier-item__level"
          [style.background-color]="tierColors[tier.level]"
        >
          {{ tier.level }}
        </div>
        <div
          class="tier-item__body"
          (drop)="drop($event)"
          (dragover)="allowDrop($event)"
        >
          @for (map of tier.body; track map) {
          <img
            [id]="map.uid"
            [attr.tier]="tier.level"
            [src]="map?.thumbnail"
            draggable="true"
            height="100"
            (dragstart)="drag($event)"
          />
          }
        </div>
      </div>
      }
    </div>

    <div class="tier-options">
      @for (map of selectableMaps(); track map.uid) {
      <div class="tier-option">
        <img
          [id]="map.uid"
          [src]="map.thumbnail"
          height="100"
          draggable="true"
          (dragstart)="drag($event)"
        />
      </div>
      }
    </div>
    }
  `,
  styleUrl: './tier-list.component.scss',
})
export class TierListComponent {
  trackmaniaService = inject(TrackmaniaService);

  tierList = signal<Tier[]>([]);
  campaign = signal<any>(undefined);
  selectedMaps = computed(() =>
    this.tierList()
      .map((tier) => tier.body)
      .flat()
      .filter((map) => map)
  );

  selectableMaps = computed(() => {
    const campaignMaps = this.campaign()?.maps ?? [];
    const selectedMaps = this.selectedMaps();
    return campaignMaps.filter((map: any) => !selectedMaps.includes(map));
  });

  tierColors = tierColors;

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

  constructor() {
    effect(() => {
      const tierList = this.tierList();
      const campaign = this.campaign();
      const user = localStorage.getItem('user')!;

      if (tierList && campaign) {
        localStorage.setItem(
          `${user}-${campaign.id}`,
          JSON.stringify(tierList)
        );
      }
    });
  }

  selectCampaign(campaignId: string) {
    this.trackmaniaService
      .getCampaign(campaignId)
      .subscribe((campaign: any) => {
        const user = localStorage.getItem('user')!;
        const storedTierList = localStorage.getItem(`${user}-${campaign.id}`);
        this.tierList.set(
          storedTierList ? JSON.parse(storedTierList) : tierListDefinition
        );
        this.campaign.set(campaign);
      });
  }

  drag(ev: DragEvent) {
    const target = ev.target as HTMLElement;
    if (!ev.dataTransfer || !target?.id) return;

    ev.dataTransfer.setData('id', target.id);

    const tier = target.getAttribute('tier');
    if (tier) {
      ev.dataTransfer.setData('tier', tier);
    }
  }

  drop(ev: DragEvent) {
    ev.preventDefault();
    const target = ev.target as HTMLElement;

    if (ev.dataTransfer === null) return console.error('dataTransfer is null');

    const id = ev.dataTransfer.getData('id'),
      sourceTierId = ev.dataTransfer.getData('tier');
    if (!id) return console.error('data is null');

    // update tierList
    const map = this.campaign().maps.find((map: any) => map.uid === id);

    this.tierList.update((tierList) => {
      const level =
        (
          target.parentElement
            ?.getElementsByClassName('tier-item__level')
            .item(0) as HTMLElement
        )?.innerText ?? '';

      if (sourceTierId === level) return tierList;

      if (!level) return tierList;
      const tier = tierList.find((tier) => tier.level === level);
      if (!tier) return tierList;

      tier.body = [...(tier.body ?? []), map];

      if (sourceTierId) {
        const sourceTier: any = tierList.find(
          (tier) => tier.level === sourceTierId
        );
        if (sourceTier) {
          sourceTier.body = sourceTier.body.filter(
            (map: any) => map.uid !== id
          );
        }
      }
      return [...tierList];
    });
  }

  allowDrop($event: DragEvent) {
    $event.preventDefault();
  }
}
