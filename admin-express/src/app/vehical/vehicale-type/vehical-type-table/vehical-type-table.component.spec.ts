import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicalTypeTableComponent } from './vehical-type-table.component';

describe('VehicalTypeTableComponent', () => {
  let component: VehicalTypeTableComponent;
  let fixture: ComponentFixture<VehicalTypeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicalTypeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicalTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
