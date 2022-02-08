import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  public userListData :any[] =[]
  constructor(private _userService:UserService) { }

  ngOnInit(): void {
    this.userList()
  }

  userList(){
    const data$ = this._userService.fnUserList()
    data$.subscribe((res:any)=>{
      console.log(res,"k");
      this.userListData = res.data
    })
  }

}
