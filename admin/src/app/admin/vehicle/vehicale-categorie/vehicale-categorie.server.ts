import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class VehicleCategoriesService {
    constructor(private _http:HttpClient) { }

    fnVehicaleCategories():Observable<any> {
      return this._http.get(environment.baseUrl+'vehicle/category')
    }
    fnVehicaleCategoriesDetails(id:any):Observable<any> {
      return this._http.get(environment.baseUrl+'vehicle/category/'+id)
    }
    fnGetPermission():Observable<any>{
      return this._http.get(environment.baseUrl+'permission/test?model=vehhical_categories')
    }
    PostfnVehicaleCategories(data:any):Observable<any>{return this._http.post(environment.baseUrl+'vehicle/category',data,
    {
      reportProgress: true,
      observe: 'events',
    }
    )}
}