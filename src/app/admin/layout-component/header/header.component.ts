import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../admin-services/layout-manage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public activeRoute:string | undefined
  constructor(private layoutService:LayoutService) {
    this.layoutService.activeRoutes.subscribe((res:any)=>{
      this.activeRoute = res
    })
   }

  ngOnInit(): void {
  }

}
