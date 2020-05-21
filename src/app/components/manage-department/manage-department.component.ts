import { DbService } from 'src/app/shared/services/db.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-manage-department',
  templateUrl: './manage-department.component.html',
  styleUrls: ['./manage-department.component.css']
})
export class ManageDepartmentComponent implements OnDestroy{
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
  dbSub:Subscription;
  userSub:Subscription;
  loading=true;
  constructor(private formBuilder: FormBuilder, public db: DbService,public auth:AuthService) {
    this.userSub=this.auth.user$.subscribe(u=>{
      this.dbSub?.unsubscribe();
      this.loading=true;
      this.dbSub=this.db
        .getDepartmentsCollectionByCompanyId(u.companyId)
        .subscribe(d => 
          {
            this.loading=false;
            console.log('new data');
            this.departmentsData = d;
            this.transformDepartmentList(d);
            this.selectedDepartmentId='';
            this.resetForm();
            this.redraw();
          });

    });
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.dbSub.unsubscribe();
  }

  addNode() {
    this.db
      .addDepartment({
        name: this.addNodeForm.value.name,
        description: this.addNodeForm.value.description,
        companyId: this.auth.userData.companyId,
        parentId: this.selectedDepartmentId
      })
      .then(d => console.log('add node',d));
  }

  transformDepartment(department:Department)
  {
    return ([
      {
        v: department.id,
        f: `<div style="font-weight:900;text-transform: uppercase;color:#C7486D;">${department.name}</div><div style="color:#7A4107;">${department.description}</div>`
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

  updateNode() {
    this.db.setDepartmentData({
      name: this.addNodeForm.value.name,
      description: this.addNodeForm.value.description,
      id:this.selectedDepartmentId
    });
  }
  deleteNode(){
    if(this.selectedDepartmentId!='')
      this.db.deleteDepartment(this.selectedDepartmentId);
  }
  redraw()
  {
    try{
    let ccComponent = this.orgChart.component;
    ccComponent.draw();
    }catch(e){console.log(e)};
  }

  printthis()
  {
    print();
  }
}
