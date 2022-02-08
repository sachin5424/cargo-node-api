import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicaleDashboardComponent } from './vehicale-dashboard.component';

describe('VehicaleDashboardComponent', () => {
  let component: VehicaleDashboardComponent;
  let fixture: ComponentFixture<VehicaleDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicaleDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicaleDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
