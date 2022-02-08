import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, take } from 'rxjs/operators';
import {  throwError } from 'rxjs';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';

interface Login {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LoginData = new Subject();
  private LoginError = new Subject()
  constructor(private _http: HttpClient,private _router:Router) { }

  fnLogin(data: Login): [Observable<any>, Observable<any>] {
    this._http.post(environment.baseUrl+'api/login', data).pipe(take(1)).subscribe((res: any) => {
      this.LoginData.next(res)
    }, (err: any) => {
      this.LoginError.next(err)
    });
    return [this.LoginData, this.LoginError]
  }
  testFnLogin(data: Login):Observable<any>{
   return this._http.post(environment.baseUrl+'api/login', data)
  }

  LoginRoutes(token:string){
    var decoded:any = jwt_decode(token);
    console.log(decoded);
    
    if(decoded.isAdmin == true || decoded.isStaf == true){
      console.log(decoded.isAdmin)
      
      this._router.navigate(['/admin/dashboard'])
    }
    
  }

  
    handleError(error: HttpErrorResponse) {
      let errorMessage = 'Unknown error!';
      if (error.error instanceof ErrorEvent) {
        // Client-side errors
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side errors
        errorMessage = `Error Code: ${error}\nMessage: ${error}`;
      }
      return throwError(errorMessage);
    }
}


