import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_http/guard/auth.guard';
import { LoginGuard } from './_http/guard/login.guard';

const routes: Routes = [
  {
    path:"auth",
    loadChildren:() => import('./auth/auth.module').then(m=>m.AuthModule),
  },
  {
    path:"admin",
    loadChildren:() => import('./admin/admin.module').then(m=>m.AdminModule),
    canActivate:[AuthGuard]
  },
  { path: '',   redirectTo: 'auth', pathMatch: 'full' },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
