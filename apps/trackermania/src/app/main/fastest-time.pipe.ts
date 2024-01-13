import { Pipe, PipeTransform } from '@angular/core';
import { TimeRegistration } from '../types';

@Pipe({
  name: 'fastestTime',
  standalone: true,
})
export class FastestTimePipe implements PipeTransform {
  transform(times?: TimeRegistration[]): TimeRegistration | undefined {
    if (!times) {
      return undefined;
    }

    return times.sort(
      (a, b) => (a.timeInMillis ?? 0) - (b.timeInMillis ?? 0)
    )[0];
  }
}
