import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticateService } from './authenticate.service';
import { LoginComponent } from './login.component';

@Component({
  standalone: true,
  imports: [RouterModule, LoginComponent],
  selector: 'trm-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  authenticate = inject(AuthenticateService);

  isLoggedIn = this.authenticate.loggedIn;

  constructor() {}
}
