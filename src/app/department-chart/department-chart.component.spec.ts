import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentChartComponent } from './department-chart.component';

describe('DepartmentChartComponent', () => {
  let component: DepartmentChartComponent;
  let fixture: ComponentFixture<DepartmentChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
