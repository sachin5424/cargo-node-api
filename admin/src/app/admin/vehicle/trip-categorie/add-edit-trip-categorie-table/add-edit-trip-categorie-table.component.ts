import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {TripCategoryService} from '../trip-category.service';
@Component({
  selector: 'app-add-edit-trip-categorie-table',
  templateUrl: './add-edit-trip-categorie-table.component.html',
  styleUrls: ['./add-edit-trip-categorie-table.component.scss']
})
export class AddEditTripCategorieTableComponent implements OnInit {
  progress: number = 0;
  loginSpinner: any
  LoginFormError: any
  check_img: boolean = false;
  upload_image = false
  vehicaleCategoriForm: any
  color = 'primary'
  mode = 'determinate'
  value: any = 0
  file: any;
  image: any;
  constructor(private _vehicaleCategoriService: TripCategoryService, public _form: FormBuilder) {
    this.vehicaleCategoriForm = this._form.group({
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      active: new FormControl(false),
    })
  }

  ngOnInit(): void {
  }

  uploadFile(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e) => {
      this.image = (<FileReader>e.target).result;
      this.vehicaleCategoriForm.value.icon = this.image;
      
      this._form.group({
        icon:this.image
      })
      this.check_img = true
      console.log(this.vehicaleCategoriForm.value);
    }
  }

  Login() {
    if (this.vehicaleCategoriForm.valid) {
      this.check_img == true? this.upload_image = true:this.upload_image = false
      this._vehicaleCategoriService.PostfnVehicaleCategories(this.vehicaleCategoriForm.value).subscribe((res: any) => {
        console.log(res);
        
        if (res.type === HttpEventType.UploadProgress) {

          this.progress = Math.round(100 * res.loaded / res.total);
          this.value = this.progress
         
        } else if (res instanceof HttpResponse) {

        }
      })


    }
    this.color = 'primary'
    this.mode = 'determinate'
    this.value = 0
  }
}