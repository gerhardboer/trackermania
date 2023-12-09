import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'trm-login',
  template: `
    <div class="login">
      <div class="login__container">
        <div class="login__form">
          <h1>Playername</h1>
          <div class="login__form__input">
            <input
              type="text"
              placeholder="player name"
              ngModel
              #username="ngModel"
            />
          </div>
          <div class="login__form__button">
            <button
              (click)="login(username.value)"
              [disabled]="!username.value"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  styleUrl: './login.component.scss',
  imports: [FormsModule],
})
export class LoginComponent {
  private router = inject(Router);

  login(username: string) {
    localStorage.setItem('user', username);
    this.router.navigate(['/season']);
  }
}
