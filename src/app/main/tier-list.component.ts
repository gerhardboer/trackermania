import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tier {
  level: string;
  body: string;
  backgroundColor?: string;
}

@Component({
  selector: 'trm-tier-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tier-list">
      @for (tier of tierList(); track tier.level) {
      <div class="tier-item">
        <div
          class="tier-item__level"
          [style.background-color]="tier.backgroundColor"
        >
          {{ tier.level }}
        </div>
        <div class="tier-item__body"></div>
      </div>
      }
    </div>

    <div class="tier-options"></div>
  `,
  styleUrl: './tier-list.component.scss',
})
export class TierListComponent implements OnInit {
  tierList = signal<Tier[]>([]);

  ngOnInit() {
    this.tierList.set([
      {
        level: 'S',
        body: 'S tier',
        backgroundColor: 'red',
      },
      {
        level: 'A',
        body: 'A tier',
        backgroundColor: 'orange',
      },
      {
        level: 'B',
        body: 'B tier',
        backgroundColor: 'yellow',
      },
      {
        level: 'C',
        body: 'C tier',
        backgroundColor: 'green',
      },
      {
        level: 'D',
        body: 'D tier',
        backgroundColor: 'blue',
      },
      {
        level: 'E',
        body: 'E tier',
        backgroundColor: 'purple',
      },
    ]);
  }
}
