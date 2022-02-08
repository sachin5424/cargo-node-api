import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTripCategorieTableComponent } from './add-edit-trip-categorie-table.component';

describe('AddEditTripCategorieTableComponent', () => {
  let component: AddEditTripCategorieTableComponent;
  let fixture: ComponentFixture<AddEditTripCategorieTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTripCategorieTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTripCategorieTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
