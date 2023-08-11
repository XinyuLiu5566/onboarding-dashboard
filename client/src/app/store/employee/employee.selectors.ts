import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from './employee.state';

export const selectEmployeeFeature =
  createFeatureSelector<EmployeeState>('employee');

export const selectPersonalInfo = createSelector(
  selectEmployeeFeature,
  (state: EmployeeState) => state.personalInfo
);

export const selectVisaStatus = createSelector(
  selectEmployeeFeature,
  (state: EmployeeState) => state.visaStatus
);

export const selectHouseInfo = createSelector(
  selectEmployeeFeature,
  (state: EmployeeState) => state.houseInfo
);

export const selectEmail = createSelector(
  selectEmployeeFeature,
  (state: EmployeeState) => state.registeredEmail
);
