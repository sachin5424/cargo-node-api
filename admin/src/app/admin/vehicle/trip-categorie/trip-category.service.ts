import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class TripCategoryService {
    trp_category_url:string = 'trip/categorie'
    constructor(private _http:HttpClient) { }

    fnVehicaleCategories():Observable<any> {
      return this._http.get(environment.baseUrl+this.trp_category_url)
    }
    fnVehicaleCategoriesDetails(id:any):Observable<any> {
      return this._http.get(environment.baseUrl+this.trp_category_url+id)
    }
    fnGetPermission():Observable<any>{
      return this._http.get(environment.baseUrl+'permission/test?model=vehhical_categories')
    }
    PostfnVehicaleCategories(data:any):Observable<any>{return this._http.post(environment.baseUrl+this.trp_category_url,data,
    {
      reportProgress: true,
      observe: 'events',
    }
    )}
}