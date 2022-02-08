import { Directive,HostListener } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { pairwise } from 'rxjs/internal/operators/pairwise';

import { Location } from '@angular/common'
@Directive({
  selector: '[appPreviousRoutes]'
})
export class PreviousRoutesDirective {
currentUrl: string;
previousUrl: any;

  
constructor(private router: Router,private location: Location) {
  this.currentUrl = this.router.url;
  
}

@HostListener('click', ['$event']) onClick($event: string){
  // this.location.back(),
  // this.router.events.subscribe(event => {
  //   if (event instanceof NavigationEnd) {        
  //     this.previousUrl = this.currentUrl;
  //     console.log(this.previousUrl);
      
  //     // this.router.navigate([this.previousUrl])
  //     this.currentUrl = event.url;
  //   };
  // });
}
}
