import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AddEditTripCategorieTableComponent} from '../add-edit-trip-categorie-table/add-edit-trip-categorie-table.component';
import {TripCategoryService} from '../trip-category.service';
// import moduleName from '';

@Component({
  selector: 'app-trip-categorie-table',
  templateUrl: './trip-categorie-table.component.html',
  styleUrls: ['./trip-categorie-table.component.scss']
})
export class TripCategorieTableComponent implements OnInit {
  public userListData:any = [];
  public vehicaleCategorieData:any[] =[];
  p: any = 1;
  count: any = 10;
  maxSize:Number =9
  pageSize: any;
  constructor(private _TripCategoriesService:TripCategoryService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.openDialog()
    this.fnGetVehicalCategorie()
  }
   fnGetVehicalCategorie(){
    this._TripCategoriesService.fnVehicaleCategories().subscribe((res:any)=>{
      this.vehicaleCategorieData = res.data.docs
      console.log(this.vehicaleCategorieData);
      
    })
   }
   onTableDataChange(event:any) {
    this.p = event;
    
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddEditTripCategorieTableComponent,{
     
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
