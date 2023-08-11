import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('jwtToken');

    if (token) {
      // Token exists, allow navigation
      return true;
    } else {
      alert('Not logged in yet. Please log in first.');
      // Token does not exist, redirect to the login page
      return this.router.createUrlTree(['/login']);
    }
  }
}
