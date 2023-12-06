import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TierListComponent } from './tier-list.component';
import { SeasonComponent } from './season.component';
import { SessionControl } from './session.control';

@Component({
  selector: 'trm-main',
  standalone: true,
  imports: [CommonModule, TierListComponent, SeasonComponent],
  template: `<main>
    <trm-season></trm-season>
    <trm-tier-list></trm-tier-list>
  </main>`,
  providers: [SessionControl],
  styles: `
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
  `,
})
export class MainComponent {}
