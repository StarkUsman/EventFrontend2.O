import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, routes } from 'src/app/core/core.index';

@Component({
  selector: 'app-sass-login',
  templateUrl: './sass-login.component.html',
  styleUrl: './sass-login.component.scss'
})
export class SassLoginComponent {
  public routes = routes
 
  public show_password = true;
  
  form = new FormGroup({
    email: new FormControl('admin@dreamguys.in', [Validators.required]),
    password: new FormControl('123456', [Validators.required]),
  });
  constructor(private router: Router, private auth: AuthService) {

  }
  get f() {
    return this.form.controls;
  }
  navigation() {
    this.router.navigate([routes.dashboard])
  }
}
