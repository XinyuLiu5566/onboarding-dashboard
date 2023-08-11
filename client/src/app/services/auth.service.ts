import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isAuthenticated(): boolean {
    // Check if the user is authenticated (e.g., check if a valid token exists)
    const token = localStorage.getItem('jwtToken');
    return !!token; // Return true if token exists, false otherwise
  }
}
