import { Pipe, PipeTransform } from '@angular/core';
import { stringify } from 'querystring';

@Pipe({
  name: 'departmentName'
})
export class DepartmentNamePipe implements PipeTransform {
  transform(value: any,id:any): any {
    let r=value.filter(d=>d.id===id);
    console.log('p',r);
    return r[0]?.name;
  }
}
