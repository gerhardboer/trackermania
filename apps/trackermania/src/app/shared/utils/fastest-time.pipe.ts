import { Pipe, PipeTransform } from '@angular/core';
import { TimeRegistration } from '../../types';

export function fastestTime(times?: TimeRegistration[]) {
  if (!times) {
    return undefined;
  }

  return times.sort((a, b) => (a.timeInMillis ?? 0) - (b.timeInMillis ?? 0))[0];
}

@Pipe({
  name: 'fastestTime',
  standalone: true,
})
export class FastestTimePipe implements PipeTransform {
  transform(times?: TimeRegistration[]): TimeRegistration | undefined {
    return fastestTime(times);
  }
}
