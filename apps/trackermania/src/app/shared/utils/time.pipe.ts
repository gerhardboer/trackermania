import { Pipe, PipeTransform } from '@angular/core';
import { Time, TimeRegistration } from '../../types';
import { formatNumber } from '@angular/common';

export function trmTimeDisplay(time?: Time) {
  if (!time) {
    return '';
  }

  const hPrev = time.h ? `${time.h}:` : '',
    mmPrev = time.mm ? `${formatNumber(time.mm, 'en-US', '2.0-0')}:` : '';

  const seconds = formatNumber(time.ss, 'en-US', '2.0-0'),
    milliseconds = formatNumber(time.SSS, 'en-US', '3.0-0');

  return `${hPrev}${mmPrev}${seconds}.${milliseconds}`;
}

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

    return trmTimeDisplay(time);
  }
}
