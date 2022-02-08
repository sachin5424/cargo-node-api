import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPermissionDirective } from './view-permission.directive';
import { PreviousRoutesDirective } from './previous-routes.directive';



@NgModule({
  declarations: [
    ViewPermissionDirective,
    PreviousRoutesDirective
  ],
  exports: [
    ViewPermissionDirective,
    PreviousRoutesDirective
  ]
})
export class DirectivesModule { }
