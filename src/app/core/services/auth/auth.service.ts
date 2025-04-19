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

  public login(email: any, password: any): any {
    return this.data.login(email, password);
  }
  
  public logout(): void {
    this.router.navigate([routes.login]);
    this.checkAuth.next("false");
    localStorage.clear();
  }
}
