import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private _id:any  | undefined;
  public userProfile:any = {}
  constructor(private _activeRoutes:ActivatedRoute,private _UserService:UserService) { }

  ngOnInit(): void {
    this._id = this._activeRoutes.snapshot.paramMap.get('id')
    this.getUserId(this._id)
  }
  getUserId(id:string){
    const data$ = this._UserService.fnUserProfile(id)
    data$.subscribe((res:any)=>{
      this.userProfile = res.data
      console.log(this.userProfile);
      

    })
  }

}
