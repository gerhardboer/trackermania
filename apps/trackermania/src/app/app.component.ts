import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';

@Component({
  standalone: true,
  imports: [RouterModule, MainComponent],
  selector: 'trm-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'trackermania';
}
