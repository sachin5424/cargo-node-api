import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { VehicaleDashboardComponent } from './vehicale-dashboard/vehicale-dashboard.component';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';

@NgModule({
  declarations: [
    VehicaleDashboardComponent,

  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,
    AngularMaterialModule,
  ]
})
export class VehicleModule { }
