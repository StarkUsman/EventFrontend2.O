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
  editordoc = jsonDoc;
  files: File[] = [];
  public routes = routes;
  nation = 'units';
  Discount='select Discount'
  Tax='tax'
  newProduct: any = {};
  units: any = [];
  categories: any = [];

  constructor(private data: DataService) {}
 
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
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  form = new FormGroup({
    editorContent: new FormControl(
      { value: jsonDoc, disabled: false },
      Validators.required()
    ),
  });
  ngOnDestroy(): void {
    this.editor.destroy();
  }
 

  ngOnInit(): void {
    this.editor = new Editor();
    this.data.getUnits().subscribe((res) => {
      this.units = res.data;
    });
    this.data.getCategory().subscribe((res) => {
      this.categories = res.data;
    });
  }

  addProduct() {
    this.data.addProduct(this.newProduct).subscribe((res) => {});
  }
}
