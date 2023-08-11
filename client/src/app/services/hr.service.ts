import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HrService {
  private apiUrl = 'http://localhost:3000/hr'; // replace with your API URL

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout(): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  getUserList(): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get(`${this.apiUrl}/user-list`, { headers });
  }

  getVisaStatusList(): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get(`${this.apiUrl}/visa-status-list`, { headers });
  }

  putOPTReceipt(id: string): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.put(`${this.apiUrl}/opt-receipt/${id}`, {}, { headers });
  }

  putOPTEAD(id: string): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.put(`${this.apiUrl}/opt-ead/${id}`, {}, { headers });
  }

  putI983(id: string): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.put(`${this.apiUrl}/i983/${id}`, {}, { headers });
  }

  putI20(id: string): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.put(`${this.apiUrl}/i20/${id}`, {}, { headers });
  }

  createUser(user: any): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post(`${this.apiUrl}/create-user`, user, { headers });
  }

  getApplicationList(): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get(`${this.apiUrl}/application-list`, { headers });
  }

  putApplication(id: string, data: any): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.put(`${this.apiUrl}/application/${id}`, data, { headers });
  }

  getHouseList(): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get(`${this.apiUrl}/house-list`, { headers });
  }

  postHouse(house: any): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post(`${this.apiUrl}/house`, house, { headers });
  }

  getFacilityReportList(id: string): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get(`${this.apiUrl}/facility-report-list/${id}`, {
      headers,
    });
  }

  postFacilityReportComment(id: string, comment: any): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post(
      `${this.apiUrl}/facility-report-comment/${id}`,
      comment,
      { headers }
    );
  }

  putFacilityReportComment(id: string, comment: any): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.put(
      `${this.apiUrl}/facility-report-comment/${id}`,
      comment,
      { headers }
    );
  }

  // Add more methods for other routes as needed

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
