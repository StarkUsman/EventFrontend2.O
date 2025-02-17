import { Component,HostListener} from '@angular/core';


@HostListener('window: resize', ['$event'])
@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent  {
  public innerHeight!: number;

}
