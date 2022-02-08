import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class LayoutService {
    public activeRoutes = new BehaviorSubject('Dashboard')
    constructor() { }

    
}