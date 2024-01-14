import { Component, signal } from '@angular/core';
import { TimePipe } from '../shared/utils/time.pipe';
import { FormsModule } from '@angular/forms';
import { ProfileColorDirective } from './profile-color.directive';

@Component({
  selector: 'trm-profiles',
  template: `
    <section class="content">
      <section class="content-title">
        <header>
          <span>Players</span>
          <button
            class="button header-button content-title__header-button"
            (click)="addPlayer.showModal()"
          >
            +
          </button>
        </header>
        <div class="content-title__subtitle"></div>
      </section>
      <section class="content-body">
        @for (player of players$(); track player.name) {
        <div class="profile" [trmProfileColor]="player.color">
          <div class="profile__image">
            <img src="/assets/avatars/{{ player.avatar }}.png" />
          </div>
          <div class="profile__name">{{ player.name }}</div>
        </div>
        }
      </section>
    </section>

    <dialog #addPlayer>
      <div class="add-player">
        <div class="dialog__title">
          <h2>Add player</h2>
          <button class="close-button" (click)="addPlayer.close()">X</button>
        </div>
        <div class="dialog__body">
          <div class="form-row">
            <label for="name">Name</label>
            <input type="text" id="name" [(ngModel)]="newPlayer.name" />
          </div>
          <div class="form-row ">
            <label for="avatar">Avater</label>
            <img
              src="/assets/avatars/{{ newPlayer.avatar ?? 1 }}.png"
              (click)="nextAvatar(newPlayer)"
            />
          </div>
          <div class="form-row">
            <label for="color">Color</label>
            <input type="color" id="color" [(ngModel)]="newPlayer.color" />
          </div>
        </div>
        <button (click)="savePlayer()">Add</button>
      </div>
    </dialog>
  `,
  styleUrl: './profiles.component.scss',
  standalone: true,
  imports: [TimePipe, FormsModule, ProfileColorDirective],
})
export class ProfilesComponent {
  newPlayer = {
    name: '',
    avatar: 1,
    color: '',
  };

  players$ = signal<any[]>([]);

  nextAvatar(newPlayer: { color: string; name: string; avatar: number }) {
    newPlayer.avatar = newPlayer.avatar === 8 ? 1 : newPlayer.avatar + 1;
  }

  savePlayer() {
    console.log(this.newPlayer);
    this.players$.update((players) => [...players, this.newPlayer]);
    this.newPlayer = {
      name: '',
      avatar: 1,
      color: '',
    };
  }
}
