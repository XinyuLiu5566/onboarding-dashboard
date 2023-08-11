import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-employee',
  templateUrl: './navbar-employee.component.html',
  styleUrls: ['./navbar-employee.component.scss'],
})
export class NavbarEmployeeComponent {
  isAuthenticated!: boolean;

  constructor() {
    this.isAuthenticated = localStorage.getItem('jwtToken') !== null;
  }

  logout() {
    alert('You have successfully logout!');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    this.isAuthenticated = false;
  }
}
