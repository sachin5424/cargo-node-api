import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicaleCategorieViewComponent } from './vehicale-categorie-view.component';

describe('VehicaleCategorieViewComponent', () => {
  let component: VehicaleCategorieViewComponent;
  let fixture: ComponentFixture<VehicaleCategorieViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicaleCategorieViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicaleCategorieViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
