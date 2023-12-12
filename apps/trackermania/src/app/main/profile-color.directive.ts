import { Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({
  selector: '[trmProfileColor]',
  standalone: true,
})
export class ProfileColorDirective {
  private element = inject(ElementRef);

  @Input() set trmProfileColor(color: string) {
    const hsl = this.hexToHSL(color);
    /**
     *   background: linear-gradient(
     *     180deg,
     *     rgba(1, 101, 143, 0.9) 0%,
     *     rgba(1, 49, 102, 1) 100%
     *   );
     */
    this.element.nativeElement.style.setProperty(
      'background',
      `linear-gradient(180deg, ${hsl.light} 0%, ${hsl.main} 100%)`
    );
  }

  private hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0,
      g = 0,
      b = 0;
    if (H.length == 4) {
      // @ts-expect-error error is fine
      r = '0x' + H[1] + H[1];
      // @ts-expect-error error is fine
      g = '0x' + H[2] + H[2];
      // @ts-expect-error error is fine
      b = '0x' + H[3] + H[3];
    } else if (H.length == 7) {
      // @ts-expect-error error is fine
      r = '0x' + H[1] + H[2];
      // @ts-expect-error error is fine
      g = '0x' + H[3] + H[4];
      // @ts-expect-error error is fine
      b = '0x' + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;

    const cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin;
    let h = 0,
      s = 0,
      l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {
      main: 'hsl(' + h + ',' + s + '%,' + l + '%)',
      light: 'hsl(' + h + ',' + s + '%,' + (l + 20) + '%)',
    };
  }
}
