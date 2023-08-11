import { Injectable } from '@angular/core';
import { Actions, act, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as EmployeeActions from './employee.actions';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Injectable()
export class EmployeeEffects {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {}

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.register),
      mergeMap((action) => {
        const headers = new HttpHeaders().set(
          'Content-Type',
          'application/json'
        );
        return this.http
          .post(`${this.apiUrl}/employee/register`, action.user, { headers })
          .pipe(
            map((res: any) => {
              // Save the email
              this.store.dispatch(
                EmployeeActions.saveEmail({ registeredEmail: res.user.email })
              );
              // Redirect the user
              this.router.navigate(['/login']);
              return EmployeeActions.registerSuccess();
            }),
            catchError((error) =>
              of(EmployeeActions.registerFailure({ error }))
            )
          );
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.login),
      mergeMap((action) =>
        this.http
          .post(`${this.apiUrl}/employee/login`, action.credentials)
          .pipe(
            tap((response: any) => {
              console.log(response.user);
              localStorage.setItem('jwtToken', response.token);
              localStorage.setItem('userId', response.user._id);
              localStorage.setItem('userRole', response.user.role);
              localStorage.setItem(
                'onboardingStatus',
                response.user.isApproved
              );

              if (response.user.role === 'employee') {
                this.router.navigate(['/onboarding']);
              } else {
                this.router.navigate(['/hr/employee-profiles']);
              }
            }),
            map((data) =>
              EmployeeActions.loadPersonalInfoSuccess({
                personalInfo: data.user,
              })
            ),
            catchError((error) => of(EmployeeActions.loginFailure({ error })))
          )
      )
    )
  );

  loadPersonalInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadPersonalInfo),
      mergeMap(() => {
        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId');
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        return this.http
          .get(`${this.apiUrl}/employee/profile`, { headers })
          .pipe(
            tap((data) => console.log('Person Data:', data)),

            map((data) =>
              EmployeeActions.loadPersonalInfoSuccess({ personalInfo: data })
            ),
            catchError((error) =>
              of(EmployeeActions.loadPersonalInfoFailure({ error }))
            )
          );
      })
    )
  );

  loadVisaStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadVisaStatus),
      mergeMap(() => {
        const token = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        return this.http.get(`${this.apiUrl}/employee/visa`, { headers }).pipe(
          tap((data: any) =>
            console.log('Visa Status Data:', data.citizenStatus)
          ),

          map((data: any) =>
            EmployeeActions.loadVisaStatusSuccess({
              visaStatus: data.citizenStatus,
            })
          ),
          catchError((error) =>
            of(EmployeeActions.loadVisaStatusFailure({ error }))
          )
        );
      })
    )
  );

  loadHouseInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadHouseInfo),
      mergeMap(() => {
        const token = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        return this.http.get(`${this.apiUrl}/employee/house`, { headers }).pipe(
          tap((data: any) => console.log('House Info Data:', data.house)),
          map((data: any) =>
            EmployeeActions.loadHouseInfoSuccess({ houseInfo: data.house })
          ),
          catchError((error) =>
            of(EmployeeActions.loadHouseInfoFailure({ error }))
          )
        );
      })
    )
  );

  submitFacilityReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.submitFacilityReport),
      mergeMap((action) => {
        const token = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        return this.http
          .post(`${this.apiUrl}/employee/facility-report`, action.report, {
            headers,
          })
          .pipe(
            map(() => EmployeeActions.loadHouseInfo()),
            catchError((error) =>
              of(EmployeeActions.submitFacilityReportFailure({ error }))
            )
          );
      })
    )
  );

  updateUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateUserProfile),
      mergeMap((action) => {
        const token = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        const formData = new FormData();

        Object.keys(action.personalInfo).forEach((key) => {
          if (
            typeof action.personalInfo[key] === 'object' &&
            action.personalInfo[key] !== null
          ) {
            // If the value is an object (excluding File and null), stringify it
            formData.append(key, JSON.stringify(action.personalInfo[key]));
          } else {
            // If the value is not an object, append it as it is
            formData.append(key, action.personalInfo[key]);
          }
        });

        formData.append('profilePicture', action.files.profilePicture);
        formData.append('workAuthFile', action.files.workAuthFile);
        formData.append('uploadedLicense', action.files.uploadedLicense);

        return this.http
          .put(`${this.apiUrl}/employee/profile`, formData, {
            headers,
          })
          .pipe(
            map((data) =>
              EmployeeActions.updateUserProfileSuccess({
                updatedPersonalInfo: data,
              })
            ),
            catchError((error) =>
              of(EmployeeActions.updateUserProfileFailure({ error }))
            )
          );
      })
    )
  );

  uploadOptReceipt$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.uploadOptReceipt),
      mergeMap((action) => {
        const token = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        const formData = new FormData();

        formData.append('optReceipt', action.files.optReceipt);
        return this.http
          .post(`${this.apiUrl}/employee/opt-receipt`, formData, {
            headers,
          })
          .pipe(
            map((data: any) =>
              EmployeeActions.uploadOptReceiptSuccess({
                updatedPersonalInfo: data,
                updatedVisaStatus: data.citizenStatus,
              })
            ),
            catchError((error) =>
              of(EmployeeActions.uploadOptReceiptFailure({ error }))
            )
          );
      })
    )
  );

  submitOnboardingForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.submitOnboardingForm),
      mergeMap((action) => {
        const token = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );

        return this.http
          .post(`${this.apiUrl}/employee/onboarding`, action.onboardingForm, {
            headers,
          })
          .pipe(
            map((data) => {
              alert(
                "You have successfully submitted, please wait for HR's response."
              );
              localStorage.setItem('onboardingStatus', 'Pending');

              return EmployeeActions.submitOnboardingFormSuccess({
                updatedOnboardingInfo: data,
              });
            }),
            catchError((error) =>
              of(EmployeeActions.submitOnboardingFormFailure({ error }))
            )
          );
      })
    )
  );

  uploadOptEad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.uploadOptEAD),
      mergeMap((action) => {
        const token = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        const formData = new FormData();

        formData.append('optEad', action.files.optEad);
        return this.http
          .post(`${this.apiUrl}/employee/opt-ead`, formData, {
            headers,
          })
          .pipe(
            map((data: any) =>
              EmployeeActions.uploadOptEADSuccess({
                updatedPersonalInfo: data,
                updatedVisaStatus: data.citizenStatus,
              })
            ),
            catchError((error) =>
              of(EmployeeActions.uploadOptEADFailure({ error }))
            )
          );
      })
    )
  );

  uploadI20$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.uploadI20),
      mergeMap((action) => {
        const token = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        const formData = new FormData();

        formData.append('i20', action.files.i20);
        return this.http
          .post(`${this.apiUrl}/employee/i20`, formData, {
            headers,
          })
          .pipe(
            map((data: any) =>
              EmployeeActions.uploadI20Success({
                updatedPersonalInfo: data,
                updatedVisaStatus: data.citizenStatus,
              })
            ),
            catchError((error) =>
              of(EmployeeActions.uploadI20Failure({ error }))
            )
          );
      })
    )
  );

  uploadI983$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.uploadI983),
      mergeMap((action) => {
        const token = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        const formData = new FormData();

        formData.append('i983', action.files.i983);
        return this.http
          .post(`${this.apiUrl}/employee/i983`, formData, {
            headers,
          })
          .pipe(
            map((data: any) =>
              EmployeeActions.uploadI983Success({
                updatedPersonalInfo: data,
                updatedVisaStatus: data.citizenStatus,
              })
            ),
            catchError((error) =>
              of(EmployeeActions.uploadI983Failure({ error }))
            )
          );
      })
    )
  );
}
