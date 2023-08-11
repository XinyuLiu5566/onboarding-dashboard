// hr.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HrState } from './hr.state';

// Get the feature state
export const selectHrState = createFeatureSelector<HrState>('hr');

// Selectors for each piece of state
export const selectLoggedIn = createSelector(
  selectHrState,
  (state: HrState) => state.loggedIn
);

export const selectUserList = createSelector(
  selectHrState,
  (state: HrState) => {
    console.log(state.userList);
    return state.userList;
  }
);

export const selectVisaStatusList = createSelector(
  selectHrState,
  (state: HrState) => state.visaStatusList
);

// Selectors for each piece of Visa Status
export const selectOptReceiptStatus = createSelector(
  selectUserList,
  (users: any[]) => users.map((user) => user.citizenStatus?.optReceipt)
);

export const selectOptEadStatus = createSelector(
  selectUserList,
  (users: any[]) => users.map((user) => user.citizenStatus?.optEad)
);

export const selectI983Status = createSelector(selectUserList, (users: any[]) =>
  users.map((user) => user.citizenStatus?.i983)
);

export const selectI20Status = createSelector(selectUserList, (users: any[]) =>
  users.map((user) => user.citizenStatus?.i20)
);

export const selectApplications = createSelector(
  selectHrState,
  (state: HrState) => state.applications
);

// Define more selectors as needed...
export const selectHouses = createSelector(
  selectHrState,
  (state: HrState) => state.houses
);

export const selectReports = createSelector(
  selectHrState,
  (state: HrState) => state.reports
);

export const selectError = createSelector(
  selectHrState,
  (state: HrState) => state.error
);

export const selectReportComments = createSelector(
  selectReports,
  (reports: any[], props: { reportId: number }) => {
    const report = reports.find((r) => r.id === props.reportId);
    return report ? report.comments : [];
  }
);
