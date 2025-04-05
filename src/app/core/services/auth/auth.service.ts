import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DataService, routes, SideBarService } from '../../core.index';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public checkAuth: BehaviorSubject<string> = new BehaviorSubject<string>(
    localStorage.getItem('authenticated') || "false"
  );

  constructor(private data: DataService, private router: Router, private sidebar: SideBarService) {}

  public login(email: any, password: any): void {
    console.log(email, password);

    this.data.login(email, password).subscribe((res: any) => {
      console.log("====================================");
      console.log(res);
      console.log("====================================");
      console.log(res.status);
      console.log("====================================");
      if (res.status == 'Active' || res.status == 'active') {
        this.checkAuth.next('true');
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem('timeOut', Date());
        localStorage.setItem('user', JSON.stringify(res));
        localStorage.setItem('userId', res.id);
        this.router.navigate([routes.dashboard]);
        localStorage.setItem('layoutPosition', '1');
      } else if (res.status == 'Inactive' || res.status == 'inactive') {
        this.checkAuth.next('false');
        alert('Your account is inactive, please contact admin');
      } else {
        this.checkAuth.next('false');
        alert('Invalid credentials');
      }
    });

    // this.checkAuth.next('true');
    // localStorage.setItem('authenticated', 'true');
    // localStorage.setItem('timeOut', Date());
    // this.router.navigate([routes.dashboard]);
    // localStorage.setItem('layoutPosition', '1');
  }
  public logout(): void {
    this.router.navigate([routes.login]);
    this.checkAuth.next("false");
    localStorage.clear();
    sessionStorage.clear();
  }
}
