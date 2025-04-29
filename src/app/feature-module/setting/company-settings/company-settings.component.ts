import { OnInit, Component } from '@angular/core';
import { DataService, routes } from 'src/app/core/core.index';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent {
  public routes = routes
  files: File[] = [];
  companySettings: any = {};
  isBeingEdited: boolean = false;

  constructor(private data: DataService) {
    this.data.getCompanySettings().subscribe((res: any) => {
      console.log(res);
      this.companySettings = res.data[0]? res.data[0] : {};

      if (this.companySettings?.logo) {
        const file = this.base64ToFile(
          this.companySettings.logo,
          'signature.png'
        );
        this.files = [file];
      }
    });
   }

   base64ToFile(data: any, filename: string) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  
  onSelect(event: { addedFiles: File[] }) {
    const file = event.addedFiles[0]; 
    if (file) {
      this.files = [file];
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.companySettings.logo = reader.result;
    };
  }
  onRemove(event:File) {
  //  this.files.splice(this.files.indexOf(event), 1);
    this.files = [];
  }
  ngOnDestroy(): void {
    // this.editor.destroy();
  }

  cancelEdit() {
    this.isBeingEdited = false;
  }

  enableEditSettings() {
    this.isBeingEdited = true;
  }

  saveSettings() {
    if(this.companySettings.id) {
      this.data.updateCompanySettings(this.companySettings).subscribe((res: any) => {
        this.isBeingEdited = false;
      });
    } else {
      this.data.saveCompanySettings(this.companySettings).subscribe((res: any) => {
        this.isBeingEdited = false;
      });
    }
  }

}
