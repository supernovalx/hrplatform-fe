import { Pipe, PipeTransform } from '@angular/core';
import { stringify } from 'querystring';

@Pipe({
  name: 'departmenName'
})
export class DepartmenNamePipe implements PipeTransform {
  count = 0;
  constructor() {}
  transform(value: string): any {
    return this.count++;
  }
}
