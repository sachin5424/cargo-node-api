import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SideNavBarComponent } from './layout-component/side-nav-bar/side-nav-bar.component';
import { FooterComponent } from './layout-component/footer/footer.component';
import { HeaderComponent } from './layout-component/header/header.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AdminDashboardNavigationComponent } from './admin-dashboard-navigation/admin-dashboard-navigation.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    SideNavBarComponent,
    FooterComponent,
    HeaderComponent,
    AdminDashboardNavigationComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AngularMaterialModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ]
})
export class AdminModule { }
