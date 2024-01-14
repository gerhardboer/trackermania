import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticateService } from './authenticate.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'trm-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  authenticate = inject(AuthenticateService);

  isLoggedIn = this.authenticate.loggedIn;

  constructor() {}
}
