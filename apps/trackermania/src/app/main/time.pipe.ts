import { Pipe, PipeTransform } from '@angular/core';
import { Time } from '../types';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(time?: Time) {
    if (!time) {
      return '-';
    }

    const hPrev = time.h ? `${time.h}h ` : '';
    return `${hPrev}${time.mm}m ${time.ss}s ${time.SSS}ms`;
  }
}
