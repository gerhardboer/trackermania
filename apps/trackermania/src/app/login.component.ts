import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticateService } from './authenticate.service';

@Component({
  selector: 'trm-login',
  template: `
    <section class="dialog">
      <section class="dialog__content">
        <header>
          <span>Login</span>
        </header>
        <section class="dialog__body">
          <button (click)="signIn()">Sign in with Google</button>
        </section>
      </section>
    </section>
  `,
  standalone: true,
  styleUrl: './login.component.scss',
  imports: [FormsModule],
})
export class LoginComponent {
  private router = inject(Router);
  private authenticate = inject(AuthenticateService);

  constructor() {
    effect(() => {
      if (this.authenticate.loggedIn()) {
        this.router.navigate(['/stats']);
      }
    });
  }

  signIn() {
    this.authenticate.login();
  }
}
