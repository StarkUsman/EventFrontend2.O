import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { routes } from '../../core.index';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardRoleAdmin {
  constructor(private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (localStorage.getItem('authenticated') && user.role === 'admin') {
      return true;
    } else {
      this.router.navigate([routes.errorPage500]);
      return false;
    }
  }
}
