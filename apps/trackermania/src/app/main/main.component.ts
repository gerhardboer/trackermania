import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TierListComponent } from './tier-list.component';

@Component({
  selector: 'trm-main',
  standalone: true,
  imports: [CommonModule, TierListComponent],
  template: ` <trm-tier-list></trm-tier-list> `,
  styles: ``,
})
export class MainComponent {}
