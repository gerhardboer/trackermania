import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'trm-season',
  template: `
    <section class="content">
      <section class="content-title">
        <h1>Stats</h1>
        <div class="content-title__subtitle"></div>
        <!--        menu    -->
      </section>
      <section class=" content-body"></section>
    </section>
  `,
  standalone: true,
  styleUrl: './stats.component.scss',
  imports: [JsonPipe],
})
export class StatsComponent {}
