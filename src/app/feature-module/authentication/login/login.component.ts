import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, routes } from 'src/app/core/core.index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public routes = routes;
  public show_password = true;
  showLoginError = false;
  loginError: any = ''
  form = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(private router: Router, private auth: AuthService) {

  }

  loginFormSubmit() {
    if (this.form.valid) {
      this.auth.login(this.form.value.email, this.form.value.password).subscribe({
        next: (res: any) => {      
          if (res.status === 'Active' || res.status === 'active') {
            sessionStorage.setItem('authenticated', 'true');
            localStorage.setItem('authenticated', 'true');
            // localStorage.setItem('timeOut', Date());
            localStorage.setItem('user', JSON.stringify(res));
            localStorage.setItem('userId', res.id);
            localStorage.setItem('layoutPosition', '1');
            this.auth.checkAuth.next('true');
      
            if (res.role === 'admin' || res.role === 'accounts') {
              this.router.navigate([routes.dashboard]);
            } else if (res.role === 'store') {
              this.router.navigate([routes.vendorsList]);
            } else {
              this.auth.checkAuth.next('false');
              this.showLoginError = true;
              this.loginError = 'Invalid account role';
              localStorage.clear();
              this.router.navigate([routes.login]);
            }
          } else {
            this.auth.checkAuth.next('false');
            this.showLoginError = true;
            this.loginError = 'Account is inactive. Please contact the admin';
          }
        },
        error: (err: any) => {
          this.auth.checkAuth.next('false');
          this.showLoginError = true;
          this.loginError = 'You have entered Invalid User Info. Please try again with correct Username and Password.';
          localStorage.clear();}
      });      
    }
  }
}
