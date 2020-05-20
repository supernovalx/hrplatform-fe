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

@Component({
  selector: 'app-manage-department',
  templateUrl: './manage-department.component.html',
  styleUrls: ['./manage-department.component.css']
})
export class ManageDepartmentComponent {
  selectedNode: ChartSelectEvent;
  public pieChart: GoogleChartInterface = {
    chartType: 'OrgChart',
    dataTable: [
      ['Name', 'Manager', 'Tooltip'],
      [
        {
          v: 'Director',
          f:
            'Director<div style="color:red; font-style:italic">Director of the company</div>'
        },
        '',
        ''
      ],
      [
        {
          v: 'Dirdawdector',
          f:
            'Director<div style="color:red; font-style:italic">Director of the company</div>'
        },
        '',
        ''
      ],
      [
        {
          v: 'VP',
          f: 'VP<div style="color:red; font-style:italic">Vice President</div>'
        },
        'Director',
        ''
      ],
      [
        {
          v: 'HR',
          f: 'HR<div style="color:red; font-style:italic">human resource</div>'
        },
        'VP',
        ''
      ],
      [
        {
          v: 'IT',
          f:
            'IT<div style="color:red; font-style:italic">information technology</div>'
        },
        'Director',
        ''
      ],
      [
        {
          v: 'PA',
          f:
            'PA<div style="color:red; font-style:italic">personal assistant</div>'
        },
        'Director',
        ''
      ]
    ],
    options: {
      allowHtml: true,
      allowCollapse: true
    }
  };
  addNodeForm = this.formBuilder.group({
    parent: [''],
    name: ['', Validators.required],
    description: ['', Validators.required]
  });
  data: any;
  constructor(private formBuilder: FormBuilder, public db: DbService) {
    this.addNodeForm.setValidators(this.departmentValidator());

    this.db
      .getDepartmentsCollectionByCompanyId('aLlgfTXgQ8NGXpOIAZVemaGsmGF3')
      .subscribe(d => (this.data = d));
  }
  onSelect(event) {
    console.log(event);
  }

  addNode() {
    this.pieChart.dataTable.push([
      {
        v: this.addNodeForm.value.name,
        f: `${this.addNodeForm.value.name}<div style="color:red; font-style:italic">${this.addNodeForm.value.description}</div>`
      },
      this.selectedNode.selectedRowValues[0],
      this.addNodeForm.value.description
    ]);

    this.db
      .addDepartment({
        name: this.addNodeForm.value.name,
        description: this.addNodeForm.value.description,
        companyId: 'aLlgfTXgQ8NGXpOIAZVemaGsmGF3',
        parentId: 'daddawd'
      })
      .then(d => console.log(d));

    let ccComponent = this.pieChart.component;
    let ccWrapper = ccComponent.wrapper;

    //force a redraw
    ccComponent.draw();
    console.log(this.pieChart);
  }

  public select(event: ChartSelectEvent) {
    if (event.message === 'deselect') event.selectedRowValues[0] = 'None';
    console.log(event);
    this.selectedNode = event;
    this.addNodeForm.patchValue({
      parent: event?.selectedRowValues[0]
    });
  }

  updateNode() {}
  public departmentValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const name = group.controls['name'];
      console.log(name);
      if (
        this.pieChart.dataTable.some(
          x => x[0].v?.toLowerCase() === name.value?.toLowerCase()
        )
      )
        name.setErrors({ nameExisted: true });
      else name.setErrors(null);
      return;
    };
  }
}
