import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicaleTypeRoutingModule } from './vehicale-type-routing.module';
import { VehicalTypeTableComponent } from './vehical-type-table/vehical-type-table.component';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';


@NgModule({
  declarations: [
    VehicalTypeTableComponent
  ],
  imports: [
    CommonModule,
    VehicaleTypeRoutingModule,
    AngularMaterialModule
  ]
})
export class VehicaleTypeModule { }
