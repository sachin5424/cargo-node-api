import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {
    constructor(private _http: HttpClient) { }
    fnUserList():Observable<any>{
      return this._http.get(environment.baseUrl+'api/user-list')
    }        
    fnUserProfile(id:any):Observable<any>{
        return this._http.get(environment.baseUrl+'api/user-profile/'+id)
    }
}