import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicaleCategorieRoutingModule } from './vehicale-categorie-routing.module';
import { VehicaleCategorieTableComponent } from './vehicale-categorie-table/vehicale-categorie-table.component';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { VehicaleCategorieViewComponent } from './vehicale-categorie-view/vehicale-categorie-view.component';
import {ttIfDirective} from './test';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { AddEditVehicaleComponent } from './add-edit-vehicale/add-edit-vehicale.component';


@NgModule({
  declarations: [
    VehicaleCategorieTableComponent,
    VehicaleCategorieViewComponent,
    ttIfDirective,
    AddEditVehicaleComponent,
  ],
  imports: [
    CommonModule,
    VehicaleCategorieRoutingModule,
    AngularMaterialModule,
    NgxPaginationModule,
    DirectivesModule
  ]
})
export class VehicaleCategorieModule { }
