import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OrgchartModule } from '@dabeng/ng-orgchart';
import { DepartmentChartComponent } from './department-chart/department-chart.component';

import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Ng2GoogleChartsModule, GoogleChartsSettings } from 'ng2-google-charts';


@NgModule({
  declarations: [
    AppComponent,
    DepartmentChartComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2GoogleChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
