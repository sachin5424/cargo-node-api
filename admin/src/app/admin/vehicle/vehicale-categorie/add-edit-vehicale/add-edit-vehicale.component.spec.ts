import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVehicaleComponent } from './add-edit-vehicale.component';

describe('AddEditVehicaleComponent', () => {
  let component: AddEditVehicaleComponent;
  let fixture: ComponentFixture<AddEditVehicaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditVehicaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditVehicaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
