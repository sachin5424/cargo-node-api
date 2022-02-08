import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripCategorieTableComponent } from './trip-categorie-table/trip-categorie-table.component';

const routes: Routes = [
  {
    path:"",
    component:TripCategorieTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripCategorieRoutingModule { }
