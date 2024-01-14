import { Pipe, PipeTransform } from '@angular/core';
import { TimeRegistration } from '../../types';
import { formatNumber } from '@angular/common';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(registration?: TimeRegistration) {
    if (!registration) {
      return '-';
    }

    const time = registration.time;

    if (!time) {
      return '-';
    }

    const hPrev = time.h ? `${time.h}:` : '';

    const minutes = formatNumber(time.mm, 'en-US', '2.0-0'),
      seconds = formatNumber(time.ss, 'en-US', '2.0-0'),
      milliseconds = formatNumber(time.SSS, 'en-US', '3.0-0');

    return `${hPrev}${minutes}:${seconds}.${milliseconds}`;
  }
}
