import { DbService } from 'src/app/shared/services/db.service';
import { Component, OnInit } from '@angular/core';
import { ChartSelectEvent, GoogleChartInterface } from 'ng2-google-charts';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { Department } from 'src/app/shared/services/department';

@Component({
  selector: 'app-manage-department',
  templateUrl: './manage-department.component.html',
  styleUrls: ['./manage-department.component.css']
})
export class ManageDepartmentComponent {
  selectedDepartmentId='';
  public orgChart: GoogleChartInterface = {
    chartType: 'OrgChart',
    dataTable: [
      
    ],
    options: {
      allowHtml: true,
      allowCollapse: true
    }
  };
  addNodeForm = this.formBuilder.group({
    selected: [''],
    name: ['', Validators.required],
    description: ['', Validators.required]
  });
  departmentsData: any;
  constructor(private formBuilder: FormBuilder, public db: DbService) {

    this.db
      .getDepartmentsCollectionByCompanyId('aLlgfTXgQ8NGXpOIAZVemaGsmGF3')
      .subscribe(d => 
        {
          console.log('new data');
          this.departmentsData = d;
          this.transformDepartmentList(d);
          this.selectedDepartmentId='';
          this.resetForm();
          this.redraw();
        });
  }

  addNode() {
    this.db
      .addDepartment({
        name: this.addNodeForm.value.name,
        description: this.addNodeForm.value.description,
        companyId: 'aLlgfTXgQ8NGXpOIAZVemaGsmGF3',
        parentId: this.selectedDepartmentId
      })
      .then(d => console.log('add node',d));
  }

  transformDepartment(department:Department)
  {
    return ([
      {
        v: department.id,
        f: `<div style="font-weight:bold;text-transform: uppercase;text-decoration:underline;">${department.name}</div><div style="color:red;">${department.description}</div>`
      },
      department.parentId,
      department.name
    ]);
  }

  transformDepartmentList(dl:any)
  {
    this.orgChart.dataTable=[['','','']];
    dl.forEach(d => {
      this.orgChart.dataTable.push(this.transformDepartment(d));
      console.log('new dept');
    });
  }

  public select(event: ChartSelectEvent) {
    if (event.message === 'deselect') this.selectedDepartmentId='';
    else this.selectedDepartmentId = event?.selectedRowValues[0];
    console.log(event);
    this.addNodeForm.patchValue({
      selected: event?.selectedRowValues[2],
      name:event?.selectedRowValues[2]
    });
  }

  resetForm(){
    this.addNodeForm.setValue({
      selected: '',
      name:'',
      description:''
    });
  }

  updateNode() {}
  deleteNode(){
    if(this.selectedDepartmentId!='')
      this.db.deleteDepartment(this.selectedDepartmentId);
  }
  redraw()
  {
    let ccComponent = this.orgChart.component;
    ccComponent.draw();
  }
}
