import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { tierColors, tierListDefinition } from './tier-list-definition';
import { FormsModule } from '@angular/forms';
import { SeasonComponent } from './season.component';

interface Tier {
  level: string;
  body: any[];
  backgroundColor?: string;
}

@Component({
  selector: 'trm-tier-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SeasonComponent, NgOptimizedImage],
  template: `
    @if(!this.campaign()) {
    <trm-season (campaignSelected)="setCampaign($event)"></trm-season>
    } @else {

    <section class="content">
      <section class="content-title">
        <header>Tier list</header>
      </section>
      <section class="content-body">
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
                [ngSrc]="map?.thumbnail"
                priority
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
              [ngSrc]="map.thumbnailUrl"
              priority
              fill
              draggable="true"
              (dragstart)="drag($event)"
            />
          </div>
          }
        </div>
      </section>
    </section>

    }
  `,
  styleUrl: './tier-list.component.scss',
})
export class TierListComponent {
  campaign = signal<any>(undefined);

  tierList = signal<Tier[]>([]);
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

  constructor() {
    effect(() => {
      const tierList = this.tierList();
      const campaign = this.campaign();
      const user = localStorage.getItem('user')!;

      if (tierList && campaign) {
        localStorage.setItem(
          `${user}-${campaign.seasonUid}`,
          JSON.stringify(tierList)
        );
      }
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

  setCampaign($event: any) {
    this.campaign.set($event);

    if (!this.campaign()) return;
    const user = localStorage.getItem('user')!;
    const storedTierList = localStorage.getItem(
      `${user}-${this.campaign().seasonUid}`
    );

    this.tierList.set(
      storedTierList ? JSON.parse(storedTierList) : tierListDefinition
    );
  }
}
