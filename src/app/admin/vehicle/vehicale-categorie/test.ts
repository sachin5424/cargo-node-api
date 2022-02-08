import { Directive, ViewContainerRef, TemplateRef, Input, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { VehicleCategoriesService } from './vehicale-categorie.server';
 
@Directive({ 
  selector: '[ttIf]' 
})
export class ttIfDirective  {
  check:any[] = []


 div = this.renderer.createElement('div');
constructor(private elRef: ElementRef, private renderer: Renderer2,private _VehicleCategoriesService:VehicleCategoriesService) {}
ngOnInit() {
  
    this.checkPermission()
    const tt:any = this.elRef
    console.log(tt,"kkkkkkkkkk");
    
  
  }
 checkPermission(){
     this._VehicleCategoriesService.fnGetPermission().subscribe((res:any)=>{
        this.check = res.temp;
        if(!this.check.includes('GET')){
            const childElements = this.elRef.nativeElement.children;
            for (let child of childElements) {
                this.renderer.removeChild(this.elRef.nativeElement, child);
              }
        }

         
     })
 }
}
 