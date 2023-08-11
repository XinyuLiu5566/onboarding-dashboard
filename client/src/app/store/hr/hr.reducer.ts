import { createReducer, on } from '@ngrx/store';
import * as HrActions from './hr.actions';
import { initialState } from './hr.state';

export const hrReducer = createReducer(
  initialState,
  on(HrActions.loginSuccess, (state, { response }) => ({
    ...state,
    loggedIn: true,
  })),
  on(HrActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(HrActions.getUserListSuccess, (state, { userList }) => ({
    ...state,
    userList,
  })),
  on(HrActions.getUserListFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(HrActions.getVisaStatusListSuccess, (state, { visaStatusList }) => ({
    ...state,
    visaStatusList,
  })),
  on(HrActions.getVisaStatusListFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(HrActions.updateOptReceiptSuccess, (state, { optReceipt }) => ({
    ...state,
    userList: state.userList.map((user) =>
      user.citizenStatus.id === optReceipt.id
        ? { ...user, citizenStatus: optReceipt }
        : user
    ),
  })),
  on(HrActions.updateOptReceiptFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(HrActions.updateOptEadSuccess, (state, { optEad }) => ({
    ...state,
    userList: state.userList.map((user) =>
      user.citizenStatus.id === optEad.id
        ? { ...user, citizenStatus: optEad }
        : user
    ),
  })),
  on(HrActions.updateOptEadFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(HrActions.updateI983Success, (state, { i983 }) => ({
    ...state,
    userList: state.userList.map((user) =>
      user.citizenStatus.id === i983.id
        ? { ...user, citizenStatus: i983 }
        : user
    ),
  })),
  on(HrActions.updateI983Failure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(HrActions.updateI20Success, (state, { i20 }) => ({
    ...state,
    userList: state.userList.map((user) =>
      user.citizenStatus.id === i20.id ? { ...user, citizenStatus: i20 } : user
    ),
  })),
  on(HrActions.updateI20Failure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(HrActions.loadApplicationsSuccess, (state, { applications }) => ({
    ...state,
    applications,
  })),
  on(HrActions.loadApplicationsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(HrActions.changeApplicationStatusSuccess, (state, { id, status }) => ({
    ...state,
    applications: state.applications.map((application) =>
      application.id === id
        ? { ...application, isApproved: status === 'approved' }
        : application
    ),
  })),
  on(HrActions.changeApplicationStatusFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(HrActions.generateTokenAndSendEmailSuccess, (state) => ({
    ...state,
    // No specific state updates for this action, just indicating success
  })),
  on(HrActions.generateTokenAndSendEmailFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  // Get house list
  on(HrActions.getHouseListSuccess, (state, { houses }) => ({
    ...state,
    houses,
  })),
  on(HrActions.getHouseListFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Post house
  on(HrActions.postHouseSuccess, (state, { house }) => ({
    ...state,
    houses: [...state.houses, house],
  })),
  on(HrActions.postHouseFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Get facility report list
  on(HrActions.getFacilityReportListSuccess, (state, { reports }) => ({
    ...state,
    reports,
  })),
  on(HrActions.getFacilityReportListFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Post facility report comment
  on(HrActions.postFacilityReportCommentSuccess, (state, { comment }) => ({
    ...state,
    reports: state.reports.map((report) =>
      report.id === comment.reportId
        ? { ...report, comments: [...report.comments, comment] }
        : report
    ),
  })),
  on(HrActions.postFacilityReportCommentFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Put (update) facility report comment
  on(HrActions.putFacilityReportCommentSuccess, (state, { comment }) => ({
    ...state,
    reports: state.reports.map((report) =>
      report.id === comment.reportId
        ? {
            ...report,
            comments: report.comments.map((c: any) =>
              c.id === comment.id ? comment : c
            ),
          }
        : report
    ),
  })),
  on(HrActions.putFacilityReportCommentFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
