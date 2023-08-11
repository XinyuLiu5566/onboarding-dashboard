import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as HrActions from './hr.actions';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HrEffects {
  private apiUrl = 'http://localhost:3000/hr'; // replace with your API URL

  constructor(private actions$: Actions, private http: HttpClient) {}

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.login),
      mergeMap((action) =>
        this.http.post(`${this.apiUrl}/login`, action.credentials).pipe(
          map((response: any) => {
            // Handle successful login response
            // Dispatch success action or perform additional logic
            return HrActions.loginSuccess({ response });
          }),
          catchError((error) => {
            // Handle error
            // Dispatch error action or perform additional error handling
            return of(HrActions.loginFailure({ error }));
          })
        )
      )
    )
  );

  // Employee Profiles Page Requests
  getUserList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.getUserList),
      mergeMap(() => {
        const headers = this.createAuthHeaders();
        console.log('im doing things');
        return this.http.get(`${this.apiUrl}/user-list`, { headers }).pipe(
          tap((response: any) => console.log('in hr.effects', response)),
          map((response: any) => {
            // Handle successful API response
            // Dispatch success action or perform additional logic
            return HrActions.getUserListSuccess({ userList: response });
          }),
          catchError((error) => {
            // Handle error
            // Dispatch error action or perform additional error handling
            return of(HrActions.getUserListFailure({ error }));
          })
        );
      })
    )
  );

  // Visa Status Managemenet Reuests
  getVisaStatusList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.getVisaStatusList),
      mergeMap(() => {
        const headers = this.createAuthHeaders();
        return this.http
          .get(`${this.apiUrl}/visa-status-list`, { headers })
          .pipe(
            map((response: any) =>
              HrActions.getVisaStatusListSuccess({ visaStatusList: response })
            ),
            catchError((error) =>
              of(HrActions.getVisaStatusListFailure({ error }))
            )
          );
      })
    )
  );

  updateOptReceipt$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.updateOptReceipt),
      mergeMap((action) => {
        const headers = this.createAuthHeaders();
        return this.http
          .put(`${this.apiUrl}/opt-receipt/${action.id}`, action, { headers })
          .pipe(
            map((response: any) =>
              HrActions.updateOptReceiptSuccess({ optReceipt: response })
            ),
            catchError((error) =>
              of(HrActions.updateOptReceiptFailure({ error }))
            )
          );
      })
    )
  );

  updateOptEad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.updateOptEad),
      mergeMap((action) => {
        const headers = this.createAuthHeaders();
        return this.http
          .put(`${this.apiUrl}/opt-ead/${action.id}`, action, { headers })
          .pipe(
            map((response: any) =>
              HrActions.updateOptEadSuccess({ optEad: response })
            ),
            catchError((error) => of(HrActions.updateOptEadFailure({ error })))
          );
      })
    )
  );

  updateI983$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.updateI983),
      mergeMap((action) => {
        const headers = this.createAuthHeaders();
        return this.http
          .put(`${this.apiUrl}/i983/${action.id}`, action, { headers })
          .pipe(
            map((response: any) =>
              HrActions.updateI983Success({ i983: response })
            ),
            catchError((error) => of(HrActions.updateI983Failure({ error })))
          );
      })
    )
  );

  updateI20$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.updateI20),
      mergeMap((action) => {
        const headers = this.createAuthHeaders();
        return this.http
          .put(`${this.apiUrl}/i20/${action.id}`, action, { headers })
          .pipe(
            map((response: any) =>
              HrActions.updateI20Success({ i20: response })
            ),
            catchError((error) => of(HrActions.updateI20Failure({ error })))
          );
      })
    )
  );

  loadApplications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.loadApplications),
      mergeMap(() => {
        const headers = this.createAuthHeaders();
        return this.http
          .get(`${this.apiUrl}/application-list`, { headers })
          .pipe(
            tap((response: any) =>
              console.log('in effects', response.data.users)
            ), // Add this line
            map((response: any) =>
              HrActions.loadApplicationsSuccess({
                applications: response.data.users,
              })
            ),
            catchError((error) =>
              of(HrActions.loadApplicationsFailure({ error }))
            )
          );
      })
    )
  );

  changeApplicationStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.changeApplicationStatus),
      mergeMap((action) => {
        const headers = this.createAuthHeaders();
        return this.http
          .put(
            `${this.apiUrl}/application/${action.id}`,
            {
              isApproved: action.status,
              applicationFeedback: action.feedback,
            },
            { headers }
          )
          .pipe(
            map(() =>
              HrActions.changeApplicationStatusSuccess({
                id: action.id,
                status: action.status,
              })
            ),
            catchError((error) =>
              of(HrActions.changeApplicationStatusFailure({ error }))
            )
          );
      })
    )
  );

  generateTokenAndSendEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.generateTokenAndSendEmail),
      mergeMap((action) => {
        const headers = this.createAuthHeaders();
        return this.http
          .post(
            `${this.apiUrl}/create-user`,
            { email: action.email, name: action.name },
            { headers }
          )
          .pipe(
            map(() => HrActions.generateTokenAndSendEmailSuccess()),
            catchError((error) =>
              of(HrActions.generateTokenAndSendEmailFailure({ error }))
            )
          );
      })
    )
  );

  // Get house list
  getHouseList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.getHouseList),
      mergeMap(() => {
        const headers = this.createAuthHeaders();
        return this.http.get(`${this.apiUrl}/house-list`, { headers }).pipe(
          map((response: any) =>
            HrActions.getHouseListSuccess({ houses: response.data.houses })
          ),
          catchError((error) => of(HrActions.getHouseListFailure({ error })))
        );
      })
    )
  );

  postHouseSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.postHouseSuccess),
      map(() => HrActions.getHouseList())
    )
  );

  // Post house
  postHouse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.postHouse),
      mergeMap((action) => {
        const headers = this.createAuthHeaders();
        return this.http
          .post(
            `${this.apiUrl}/house`,
            {
              addressStreet: action.addressStreet,
              addressCity: action.addressCity,
              addressState: action.addressState,
              addressZipcode: action.addressZipcode,
              landlordName: action.landlordName,
              landlordPhone: action.landlordPhone,
              landlord_email: action.landlord_email,
              residentsNum: action.residentsNum,
              bedsNum: action.bedsNum,
              mattressesNum: action.mattressesNum,
              tablesNum: action.tablesNum,
              chairsNum: action.chairsNum,
            },
            { headers }
          )
          .pipe(
            map((response: any) =>
              HrActions.postHouseSuccess({ house: response.data.house })
            ),
            catchError((error) => of(HrActions.postHouseFailure({ error })))
          );
      })
    )
  );

  // Get facility report list
  getFacilityReportList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.getFacilityReportList),
      mergeMap((action) => {
        const headers = this.createAuthHeaders();
        return this.http
          .get(`${this.apiUrl}/facility-report-list/${action.id}`, { headers })
          .pipe(
            map((response: any) =>
              HrActions.getFacilityReportListSuccess({
                reports: response.data.reports,
              })
            ),
            catchError((error) =>
              of(HrActions.getFacilityReportListFailure({ error }))
            )
          );
      })
    )
  );

  // Post facility report comment
  postFacilityReportComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.postFacilityReportComment),
      mergeMap((action) => {
        const headers = this.createAuthHeaders();
        return this.http
          .post(
            `${this.apiUrl}/facility-report-comment/${action.id}`,
            { userId: action.userId, description: action.description },
            { headers }
          )
          .pipe(
            map((response: any) =>
              HrActions.postFacilityReportCommentSuccess({
                comment: response.data.comment,
              })
            ),
            catchError((error) =>
              of(HrActions.postFacilityReportCommentFailure({ error }))
            )
          );
      })
    )
  );

  // Put (update) facility report comment
  putFacilityReportComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HrActions.putFacilityReportComment),
      mergeMap((action) => {
        const headers = this.createAuthHeaders();
        return this.http
          .put(
            `${this.apiUrl}/facility-report-comment/${action.id}`,
            { description: action.description },
            { headers }
          )
          .pipe(
            map((response: any) =>
              HrActions.putFacilityReportCommentSuccess({
                comment: response.data.comment,
              })
            ),
            catchError((error) =>
              of(HrActions.putFacilityReportCommentFailure({ error }))
            )
          );
      })
    )
  );
}
