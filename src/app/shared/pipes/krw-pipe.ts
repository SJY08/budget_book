import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'krw', standalone: true })
export class KrwPipe implements PipeTransform {
  transform(value: number): string {
    return value.toLocaleString('ko-KR') + '원';
  }
}
