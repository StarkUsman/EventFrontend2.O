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
  files1: File[] = [];
  companySettings: any = {};
  isBeingEdited: boolean = false;

  constructor(private data: DataService) {
    this.data.getCompanySettings().subscribe((res: any) => {
      this.companySettings = res.data[0]? res.data[0] : {};

      if (this.companySettings?.logo) {
        const file = this.base64ToFile(
          this.companySettings.logo,
          'signature.png'
        );
        this.files = [file];
      }
      if (this.companySettings?.icon) {
        const file1 = this.base64ToFile(
          this.companySettings.icon,
          'signature.png'
        );
        this.files1 = [file1];
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

  onSelect1(event: { addedFiles: File[] }) {
    const file1 = event.addedFiles[0]; 
    if (file1) {
      this.files1 = [file1];
    }

    const reader = new FileReader();
    reader.readAsDataURL(file1);
    reader.onload = () => {
      this.companySettings.icon = reader.result;
    };
  }
  onRemove(event:File) {
  //  this.files.splice(this.files.indexOf(event), 1);
    this.files = [];
  }
  onRemove1(event:File) {
  //  this.files.splice(this.files.indexOf(event), 1);
    this.files1 = [];
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
        localStorage.setItem('companySettings', JSON.stringify(this.companySettings));
        this.isBeingEdited = false;
        window.location.reload();
      });
    } else {
      this.data.saveCompanySettings(this.companySettings).subscribe((res: any) => {
        localStorage.setItem('companySettings', JSON.stringify(this.companySettings));
        this.isBeingEdited = false;
        window.location.reload();
      });
    }
  }

}
