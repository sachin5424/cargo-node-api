import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VehicaleCategorieTableComponent} from './vehicale-categorie-table/vehicale-categorie-table.component';
import {VehicaleCategorieViewComponent} from './vehicale-categorie-view/vehicale-categorie-view.component';


const routes: Routes = [
  {
    path:"",
    component:VehicaleCategorieTableComponent
  },
  {
    path:":id",
    component:VehicaleCategorieViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicaleCategorieRoutingModule { }
