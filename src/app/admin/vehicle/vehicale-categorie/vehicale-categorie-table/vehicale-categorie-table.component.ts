import { Component, OnInit } from '@angular/core';
import { VehicleCategoriesService } from '../vehicale-categorie.server';
import {MatDialog} from '@angular/material/dialog';
import {AddEditVehicaleComponent} from '../add-edit-vehicale/add-edit-vehicale.component';
@Component({
  selector: 'app-vehicale-categorie-table',
  templateUrl: './vehicale-categorie-table.component.html',
  styleUrls: ['./vehicale-categorie-table.component.scss']
})
export class VehicaleCategorieTableComponent implements OnInit {
  public userListData:any = [];
  public vehicaleCategorieData:any[] =[];
  p: any = 1;
  count: any = 10;
  maxSize:Number =9
  pageSize: any;
  constructor(private _VehicleCategoriesService:VehicleCategoriesService,public dialog: MatDialog) { }

  ngOnInit(): void {
    // this.openDialog()
    this.fnGetVehicalCategorie()
  }
   fnGetVehicalCategorie(){
    this._VehicleCategoriesService.fnVehicaleCategories().subscribe((res:any)=>{
      this.vehicaleCategorieData = res.data.docs
      console.log(this.vehicaleCategorieData);
      
    })
   }
   onTableDataChange(event:any) {
    this.p = event;
    
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddEditVehicaleComponent,{
     
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

 
  

  // handlePageSizeChange(event:any) {
  //   this.pageSize = event.target.value;
  //   this.p = 1;
  //   this.retrieveTutorials();
  // }
}
