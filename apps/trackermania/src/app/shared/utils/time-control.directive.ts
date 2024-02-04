import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Time } from '../../types';
import { trmTimeDisplay } from './time.pipe';

@Directive({
  selector: '[trmTimeControl]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TimeControlDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class TimeControlDirective implements ControlValueAccessor {
  onChange;

  constructor(private renderer: Renderer2, private element: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  input(value) {
    if (!value) return this.onChange({ h: 0, mm: 0, ss: 0, SSS: 0 });

    const time = value.match(
      /((\d{1,2})\.((\d{1,2})\.))?((\d{1,2})\.)?(\d{1,2})(\.(\d{3}))/
    );

    if (time) {
      /*
        Group 2: Hours (hh) - optional
        Group 4 or 6: Minutes (MM) - optional. 4 if hours are present, 6 if not
        Group 7: Seconds (ss)
        Group 9: Milliseconds (SSS) - optional
      */
      const [h, mm, ss, SSS] = [
        time[2],
        time[4] ?? time[6],
        time[7],
        time[9],
      ].map((t) => (t ? parseInt(t, 10) : 0));

      this.onChange({
        h,
        mm,
        ss,
        SSS,
      });
    }
  }

  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  writeValue(value: Time): void {
    const element = this.element.nativeElement;

    this.renderer.setProperty(element, 'value', trmTimeDisplay(value));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
}
