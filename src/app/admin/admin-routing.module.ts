import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardNavigationComponent } from './admin-dashboard-navigation/admin-dashboard-navigation.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  {
    path:'',
    component:AdminDashboardNavigationComponent,
   
    children:[
      {
        path:'dashboard',
        component:AdminDashboardComponent
      },
      {
        path:'user',
        loadChildren:() => import('./user/user.module').then(m=>m.UserModule)
      },
      {
        path:'vehicle',
        loadChildren:() => import('./vehicle/vehicle.module').then(m=>m.VehicleModule)
      },
      
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
