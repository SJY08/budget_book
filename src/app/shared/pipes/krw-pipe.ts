import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'krw',
})
export class KrwPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
