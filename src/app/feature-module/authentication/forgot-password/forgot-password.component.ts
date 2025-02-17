import { Component} from '@angular/core';
import { routes } from 'src/app/core/core.index';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent  {
  public routes = routes;

 
}
