import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Directive, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Directive({
  selector: '[appViewPermission]'
})
export class ViewPermissionDirective  implements AfterViewInit{
  check:any[] = []
  @Input() model_name: any;
  @Input() method:any
  @ViewChild('cardBody', { static: true, read: ElementRef })cardBody!: ElementRef;
  div = this.renderer.createElement('div');
  @ViewChild('title')
  title!: ElementRef;
  ngAfterViewInit(): void {
  
  
    
  }
 constructor(private elRef: ElementRef, private renderer: Renderer2, private _http:HttpClient) {

 }
 
 ngOnInit(): void {
 
   this.fnGetPermission()
 }

 fnGetPermission(){
   this._http.get(environment.baseUrl+'api/test?model='+this.model_name).subscribe((res:any)=>{
    this.check = res.temp;
    
    if(!this.check.includes(this.method)){
     
    //  this.cardBody.nativeElement.remove()
      
        const childElements = this.elRef.nativeElement.children;
        for (let child of childElements) {
  
            this.renderer.removeChild(this.elRef.nativeElement, child);
          }
      }

  })
}


}


