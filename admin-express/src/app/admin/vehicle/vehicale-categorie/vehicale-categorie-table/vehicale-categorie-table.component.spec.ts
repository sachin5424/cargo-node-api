import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicaleCategorieTableComponent } from './vehicale-categorie-table.component';

describe('VehicaleCategorieTableComponent', () => {
  let component: VehicaleCategorieTableComponent;
  let fixture: ComponentFixture<VehicaleCategorieTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicaleCategorieTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicaleCategorieTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
