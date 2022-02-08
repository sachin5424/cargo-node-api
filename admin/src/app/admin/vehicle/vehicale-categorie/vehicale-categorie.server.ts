import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class VehicleCategoriesService {
    constructor(private _http:HttpClient) { }

    fnVehicaleCategories():Observable<any> {
      return this._http.get(environment.baseUrl+'api/vehical-categorie')
    }
    fnVehicaleCategoriesDetails(id:any):Observable<any> {
      return this._http.get(environment.baseUrl+'api/vehical-categorie/'+id)
    }
    fnGetPermission():Observable<any>{
      return this._http.get(environment.baseUrl+'api/test?model=vehhical_categories')
    }
    PostfnVehicaleCategories(data:any):Observable<any>{return this._http.post(environment.baseUrl+'api/vehical-categorie',data,
    {
      reportProgress: true,
      observe: 'events',
    }
    )}
}