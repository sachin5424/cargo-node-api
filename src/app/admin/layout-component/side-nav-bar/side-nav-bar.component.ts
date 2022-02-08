import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../admin-services/layout-manage.service';

interface adminROute {
  title:String,
  router:String,
  icon:String
}

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent implements OnInit {
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  adminROutes:any[] =[
     {
       title:"Dashboard",
       route:"dashboard"
     },
     {
       title:"Vehicle",
       route:'vehicle'
      },
      {
        title:"user",
        route:"user"
      },
  ]
  constructor(private layoutService:LayoutService) { }

  ngOnInit(): void {
  }
  onClick(name:string){
    this.layoutService.activeRoutes.next(name)
  }

}
