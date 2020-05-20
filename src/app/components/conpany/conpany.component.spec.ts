import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConpanyComponent } from './conpany.component';

describe('ConpanyComponent', () => {
  let component: ConpanyComponent;
  let fixture: ComponentFixture<ConpanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConpanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConpanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
