import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GoogleChartInterface, ChartSelectEvent } from 'ng2-google-charts';

@Component({
  selector: 'app-department-chart',
  templateUrl: './department-chart.component.html',
  styleUrls: ['./department-chart.component.css']
})
export class DepartmentChartComponent {
  selectedNode:ChartSelectEvent;
  public pieChart: GoogleChartInterface = {
    chartType: 'OrgChart',
    dataTable: [
      ['Name',   'Manager', 'Tooltip'],
      [{v: 'Mike', f: 'Mike<div style="color:red; font-style:italic">President</div>'}, '', 'The President'],
      [{v: 'Jim', f: 'Jim<div style="color:red; font-style:italic">Vice President</div>'}, 'Mike', 'VP'],
      ['Alice', 'Mike', ''],
      ['Bob', 'Jim', 'Bob Sponge'],
      ['Carol', 'Bob', '']
    ],
    options: {
      allowHtml: true,
      allowCollapse: true
    }
  };

   onSelect(event)
   {
     console.log(event);
   }

   add(){
     //this.pieChart.dataTable.push(['Carol', 'Alice', '']);
     //console.log(this.data);
   }

   public select(event: ChartSelectEvent) {
     if(event.message==="deselect") return;
    console.log(event);
    this.selectedNode=event;

  }
}
