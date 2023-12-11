import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(time: { h: string; mm: string; ss: string; SSS: string }) {
    const hPrev = time.h ? `${time.h}h ` : '';
    return `${hPrev}${time.mm}m ${time.ss}s ${time.SSS}ms`;
  }
}
