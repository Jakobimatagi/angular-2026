import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'example' })
export class ExamplePipe implements PipeTransform {
  transform(value: unknown, ..._args: unknown[]): unknown {
    return value;
  }
}
