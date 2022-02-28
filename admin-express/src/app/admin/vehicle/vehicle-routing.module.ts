import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicaleDashboardComponent } from './vehicale-dashboard/vehicale-dashboard.component';

const routes: Routes = [
  {
    path:"",
    component:VehicaleDashboardComponent
  },
  {
    path:'vehicle-categorie',
    loadChildren:() => import('./vehicale-categorie/vehicale-categorie.module').then(m=>m.VehicaleCategorieModule)
  },
  {
    path:"trip-categorie",
    loadChildren:() => import('./trip-categorie/trip-categorie.module').then(m=>m.TripCategorieModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
