import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'krw',
  standalone: true,
})
export class KrwPipe implements PipeTransform {
  transform(value: number): string {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(value);
  }
}
