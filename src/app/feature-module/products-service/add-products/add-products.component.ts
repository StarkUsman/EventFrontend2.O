import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { routes, DataService } from 'src/app/core/core.index';
import jsonDoc from './doc'

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnDestroy,OnInit {
  files: File[] = [];
  public routes = routes;
  newProduct: any = {};
  units: any = [];
  categories: any = [];
  products: any = [];

  constructor(private data: DataService) {}
 
  onSelect(event: { addedFiles: File[] }) {
    const file = event.addedFiles[0]; 
    this.files.push(...event.addedFiles);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.newProduct.img = reader.result;
    };
  }
  onRemove(event:File) {
   this.files.splice(this.files.indexOf(event), 1);
  }
  ngOnDestroy(): void {
    // this.editor.destroy();
  }
 

  ngOnInit(): void {
    this.data.getProductlist().subscribe((res) => {
      this.products = res.data;
      this.newProduct.code = res.data[res.data.length - 1]?.code ? parseFloat(res.data[res.data.length - 1].code) + 1 : 101;
      this.newProduct.code = String(this.newProduct.code).padStart(6, '0');
    });

    this.data.getUnits().subscribe((res) => {
      this.units = res.data;
    });
    this.data.getCategory().subscribe((res) => {
      this.categories = res.data;
      this.newProduct.category = res.data[0]?.id;
    });
  }

  addProduct() {
    this.data.addProduct(this.newProduct).subscribe((res) => {
      let nextProcuctCode = parseFloat(this.newProduct.code) + 1;
      this.newProduct = {};
      this.newProduct.code = String(nextProcuctCode).padStart(6, '0');
      this.newProduct.category = this.categories[0]?.id;
    });
  }
}
