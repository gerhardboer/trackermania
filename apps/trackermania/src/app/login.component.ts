import { Component, inject } from '@angular/core';
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
          <div class="form-row">
            <input
              type="text"
              placeholder="your player name"
              ngModel
              #username="ngModel"
            />
          </div>
        </section>
        <section class="dialog__footer">
          <button
            class="button"
            (click)="login(username.value)"
            [disabled]="!username.value"
          >
            Go
          </button>
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

  login(username: string) {
    this.authenticate.login(username);
    this.router.navigate(['/times']);
  }
}
