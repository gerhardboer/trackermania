import { Component, Input } from '@angular/core';

@Component({
  selector: 'trm-loading',
  template: `
    <div class="loading-spinner" [style]="'font-size: ' + size + 'rem'"></div>
  `,
  styles: `
    .loading-spinner {  
  /*  control spinner size with setting font-size  */
  font-size: 0.6rem;
  border: .4em solid #fff;
  border-top-color: rgba(255,255,255,.5);
  border-radius: 50%;
  width: 2em;
  height: 2em;
  animation: loading-spinner 2s linear infinite;
  margin: 0 auto;
  box-sizing: border-box;
}

@keyframes loading-spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
    `,
  standalone: true,
})
export class LoadingComponent {
  @Input({
    transform: (input: string) => {
      switch (input) {
        case 'large':
          return '2';
        case 'small':
        default:
          return '0.6';
      }
    },
  })
  /**
   * Size of the spinner
   * @default 'small'
   * @type 'small' | 'large'*
   */
  size: string = '';
}
