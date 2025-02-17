import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, routes } from 'src/app/core/core.index';

@Component({
  selector: 'app-sass-register',
  templateUrl: './sass-register.component.html',
  styleUrl: './sass-register.component.scss'
})
export class SassRegisterComponent {
  public routes = routes
  
 
  public show_password = true;
  public showConfirmPassword: boolean = false;
  
  form = new FormGroup({
    email: new FormControl('admin@dreamguys.in', [Validators.required]),
    password: new FormControl('123456', [Validators.required]),
  });
  constructor(private router: Router, private auth: AuthService) {

  }
  get f() {
    return this.form.controls;
  }
 
  togglePasswordVisibility() {
    this.show_password = !this.show_password;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navigation() {
    this.router.navigate([routes.sassLogin])
  }


}
