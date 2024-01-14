import { Component, effect, inject } from '@angular/core';
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
          <button
            (click)="signIn()"
            class="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-google firebaseui-id-idp-button"
            data-provider-id="google.com"
            style="background-color:#ffffff"
          >
            <span class="firebaseui-idp-icon-wrapper">
              <img
                class="firebaseui-idp-icon"
                alt=""
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              />
            </span>
            <span class="firebaseui-idp-text firebaseui-idp-text-long">
              Sign in with Google</span
            >
            <span class="firebaseui-idp-text firebaseui-idp-text-short">
              Google</span
            >
          </button>
        </section>
      </section>
    </section>
  `,
  standalone: true,
  styleUrl: './login.component.scss',
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
