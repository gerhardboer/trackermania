import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'trmMapNumber', standalone: true })
export class MapNumberPipe implements PipeTransform {
  /**
   * returns the map number from a string like "Map Name - 01"
   *
   * @param value
   */
  transform(value: string): string {
    return value.split(' - ')[1];
  }
}
