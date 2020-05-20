import { Component, OnInit } from '@angular/core';
import { ChartSelectEvent, GoogleChartInterface } from 'ng2-google-charts';
import { FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-manage-department',
  templateUrl: './manage-department.component.html',
  styleUrls: ['./manage-department.component.css']
})
export class ManageDepartmentComponent  {

  selectedNode:ChartSelectEvent;
  public pieChart: GoogleChartInterface = {
    chartType: 'OrgChart',
    dataTable: [
      ['Name',   'Manager', 'Tooltip'],
      [{v: 'Director', f: 'Director<div style="color:red; font-style:italic">Director of the company</div>'}, '', ''],
      [{v: 'VP', f: 'VP<div style="color:red; font-style:italic">Vice President</div>'}, 'Director',''],
      [{v:'HR',f:'HR<div style="color:red; font-style:italic">human resource</div>'}, 'VP', ''],
      [{v:'IT',f:'IT<div style="color:red; font-style:italic">information technology</div>'}, 'Director', ''],
      [{v:'PA',f:'PA<div style="color:red; font-style:italic">personal assistant</div>'}, 'Director', '']
    ],
    options: {
      allowHtml: true,
      allowCollapse: true
    }
  };
  addNodeForm:FormGroup;
  constructor(private formBuilder:FormBuilder)
  {
    this.addNodeForm = this.formBuilder.group({
      name: ['',Validators.required],
      desc: ''
    });
    this.addNodeForm.setValidators(this.departmentValidator());
  }
   onSelect(event)
   {
     console.log(event);
   }

   addNode(data){
     this.pieChart.dataTable.push([{v:data.name,f:`${data.name}<div style="color:red; font-style:italic">${data.desc}</div>`}, this.selectedNode.selectedRowValues[0], data.desc]);

     let ccComponent = this.pieChart.component;
    let ccWrapper = ccComponent.wrapper;

    //force a redraw
    ccComponent.draw();
     console.log(this.pieChart);
   }

   public select(event: ChartSelectEvent) {
     if(event.message==="deselect") return;
    console.log(event);
    this.selectedNode=event;

  }
  public departmentValidator() : ValidatorFn{
    return (group: FormGroup): ValidationErrors => {
       const name = group.controls['name'];
       console.log(name);
       if(this.pieChart.dataTable.some(x=>x[0].v?.toLowerCase()===name.value?.toLowerCase()))
         name.setErrors({nameExisted:true});
        else
          name.setErrors(null);
       return;
 };
}
}
