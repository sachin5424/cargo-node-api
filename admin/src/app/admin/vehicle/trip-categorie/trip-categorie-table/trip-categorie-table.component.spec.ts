import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripCategorieTableComponent } from './trip-categorie-table.component';

describe('TripCategorieTableComponent', () => {
  let component: TripCategorieTableComponent;
  let fixture: ComponentFixture<TripCategorieTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripCategorieTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripCategorieTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
