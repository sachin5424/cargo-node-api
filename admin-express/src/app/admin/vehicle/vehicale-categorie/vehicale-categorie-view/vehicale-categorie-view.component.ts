import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/admin/user/services/user.service';
import { VehicleCategoriesService } from '../vehicale-categorie.server';

@Component({
  selector: 'app-vehicale-categorie-view',
  templateUrl: './vehicale-categorie-view.component.html',
  styleUrls: ['./vehicale-categorie-view.component.scss']
})
export class VehicaleCategorieViewComponent implements OnInit {
  private _id:any  | undefined;
  public data:any = {}
  constructor(private _activeRoutes:ActivatedRoute,private _VehicleCategoriesService:VehicleCategoriesService) { }

  ngOnInit(): void {
    this._id = this._activeRoutes.snapshot.paramMap.get('id')
    this.getUserId(this._id)
  }
  getUserId(id:string){
    const data$ = this._VehicleCategoriesService.fnVehicaleCategoriesDetails(id)
    data$.subscribe((res:any)=>{
      this.data = res.data
      console.log(this.data);
      

    })
  }

}
