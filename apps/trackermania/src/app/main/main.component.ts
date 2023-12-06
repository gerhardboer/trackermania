import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'trm-main',
  template: ` <router-outlet></router-outlet> `,
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class MainComponent {}
