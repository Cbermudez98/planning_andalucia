import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyJson'
})
export class PrettyJsonPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return JSON.stringify(value, undefined, 4)
    .replace(/ /g, '&nbsp;')
    .replace(/\n/g, '<br/>');;
  }

}
