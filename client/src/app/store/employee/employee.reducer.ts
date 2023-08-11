import { createReducer, on } from '@ngrx/store';
import { initialState } from './employee.state';
import * as EmployeeActions from './employee.actions';

export const employeeReducer = createReducer(
  initialState,
  on(EmployeeActions.loadPersonalInfoSuccess, (state, { personalInfo }) => ({
    ...state,
    personalInfo,
    error: null,
  })),
  on(EmployeeActions.loadVisaStatusSuccess, (state, { visaStatus }) => ({
    ...state,
    visaStatus,
    error: null,
  })),
  on(EmployeeActions.loadHouseInfoSuccess, (state, { houseInfo }) => ({
    ...state,
    houseInfo,
    error: null,
  })),
  on(EmployeeActions.loadPersonalInfoFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(EmployeeActions.loadVisaStatusFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(EmployeeActions.loadHouseInfoFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(EmployeeActions.updateUserProfileSuccess, (state, action) => ({
    ...state,
    personalInfo: action.updatedPersonalInfo,
  })),
  on(
    EmployeeActions.uploadOptReceiptSuccess,
    (state, { updatedVisaStatus, updatedPersonalInfo }) => ({
      ...state,
      visaStatus: updatedVisaStatus,
      personalInfo: updatedPersonalInfo,
    })
  ),
  on(EmployeeActions.uploadOptReceiptFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(EmployeeActions.saveEmail, (state, action) => {
    return {
      ...state,
      registeredEmail: action.registeredEmail,
    };
  }),

  on(EmployeeActions.submitOnboardingFormSuccess, (state, action) => ({
    ...state,
    personalInfo: action.updatedOnboardingInfo,
  }))
);
