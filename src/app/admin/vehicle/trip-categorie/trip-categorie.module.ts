import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripCategorieRoutingModule } from './trip-categorie-routing.module';
import { TripCategorieTableComponent } from './trip-categorie-table/trip-categorie-table.component';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddEditTripCategorieTableComponent } from './add-edit-trip-categorie-table/add-edit-trip-categorie-table.component';


@NgModule({
  declarations: [
    TripCategorieTableComponent,
    AddEditTripCategorieTableComponent
  ],
  imports: [
    CommonModule,
    TripCategorieRoutingModule,
    AngularMaterialModule,
    DirectivesModule,
    NgxPaginationModule
  ]
})
export class TripCategorieModule { }
