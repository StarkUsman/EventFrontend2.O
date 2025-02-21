import { Component,OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DataService, routes } from 'src/app/core/core.index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.scss']
})
export class EditProductsComponent implements OnInit {
  public routes = routes;
  files: File[] = [];
  Units='select units'
  Discount='select discount'
  Tax='select tax'
  productToEdit: any = {};

  constructor(private route: ActivatedRoute, private data: DataService) {}

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    sanitize: false,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let id = params['id'];
      this.data.getProductById(id).subscribe((res: any) => {
        this.productToEdit = res;
      });
    });
  }
  
  onSelect(event: { addedFiles: File[] }) {
    const file = event.addedFiles[0]; 
    this.files.push(...event.addedFiles);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.productToEdit.img = reader.result;
    };
  }
  onRemove(event:File) {
   this.files.splice(this.files.indexOf(event), 1);
  }

  updateProduct() {
    this.data.updateProduct(this.productToEdit).subscribe((res) => {});
  }

}
