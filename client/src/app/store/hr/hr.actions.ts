import { createAction, props } from '@ngrx/store';

// login request
export const login = createAction('[HR] Login', props<{ credentials: any }>());
export const loginSuccess = createAction(
  '[HR] Login Success',
  props<{ response: any }>()
);
export const loginFailure = createAction(
  '[HR] Login Failure',
  props<{ error: any }>()
);

// get user list
export const getUserList = createAction('[HR] Get User List');
export const getUserListSuccess = createAction(
  '[HR] Get User List Success',
  props<{ userList: any[] }>()
);
export const getUserListFailure = createAction(
  '[HR] Get User List Failure',
  props<{ error: any }>()
);

// Get visa status list
export const getVisaStatusList = createAction('[HR] Get Visa Status List');
export const getVisaStatusListSuccess = createAction(
  '[HR] Get Visa Status List Success',
  props<{ visaStatusList: any[] }>()
);
export const getVisaStatusListFailure = createAction(
  '[HR] Get Visa Status List Failure',
  props<{ error: any }>()
);

// Update OPT Receipt
export const updateOptReceipt = createAction(
  '[HR] Update OPT Receipt',
  props<{ id: string; optReceiptStatus: string; feedback: string }>()
);
export const updateOptReceiptSuccess = createAction(
  '[HR] Update OPT Receipt Success',
  props<{ optReceipt: any }>()
);
export const updateOptReceiptFailure = createAction(
  '[HR] Update OPT Receipt Failure',
  props<{ error: any }>()
);

// Update OPT EAD
export const updateOptEad = createAction(
  '[HR] Update OPT EAD',
  props<{ id: string; optEadStatus: string; feedback: string }>()
);
export const updateOptEadSuccess = createAction(
  '[HR] Update OPT EAD Success',
  props<{ optEad: any }>()
);
export const updateOptEadFailure = createAction(
  '[HR] Update OPT EAD Failure',
  props<{ error: any }>()
);

// Update I-983
export const updateI983 = createAction(
  '[HR] Update I-983',
  props<{ id: string; i983Status: string; feedback: string }>()
);
export const updateI983Success = createAction(
  '[HR] Update I-983 Success',
  props<{ i983: any }>()
);
export const updateI983Failure = createAction(
  '[HR] Update I-983 Failure',
  props<{ error: any }>()
);

// Update I-20
export const updateI20 = createAction(
  '[HR] Update I-20',
  props<{ id: string; i20Status: string; feedback: string }>()
);
export const updateI20Success = createAction(
  '[HR] Update I-20 Success',
  props<{ i20: any }>()
);
export const updateI20Failure = createAction(
  '[HR] Update I-20 Failure',
  props<{ error: any }>()
);

// load applications
export const loadApplications = createAction('[HR] Load Applications');
export const loadApplicationsSuccess = createAction(
  '[HR] Load Applications Success',
  props<{ applications: any[] }>()
);
export const loadApplicationsFailure = createAction(
  '[HR] Load Applications Failure',
  props<{ error: any }>()
);

// change application status
export const changeApplicationStatus = createAction(
  '[HR] Change Application Status',
  props<{ id: number; status: string; feedback?: string }>()
);
export const changeApplicationStatusSuccess = createAction(
  '[HR] Change Application Status Success',
  props<{ id: number; status: string }>()
);
export const changeApplicationStatusFailure = createAction(
  '[HR] Change Application Status Failure',
  props<{ error: any }>()
);

// generate token and send email
export const generateTokenAndSendEmail = createAction(
  '[HR] Generate Token And Send Email',
  props<{ email: string; name: string }>()
);
export const generateTokenAndSendEmailSuccess = createAction(
  '[HR] Generate Token And Send Email Success'
);
export const generateTokenAndSendEmailFailure = createAction(
  '[HR] Generate Token And Send Email Failure',
  props<{ error: any }>()
);

// Get house list
export const getHouseList = createAction('[HR] Get House List');
export const getHouseListSuccess = createAction(
  '[HR] Get House List Success',
  props<{ houses: any[] }>()
);
export const getHouseListFailure = createAction(
  '[HR] Get House List Failure',
  props<{ error: any }>()
);

// Post house
export const postHouse = createAction(
  '[HR] Post House',
  props<{
    addressStreet: string;
    addressCity: string;
    addressState: string;
    addressZipcode: string;
    landlordName: string;
    landlordPhone: string;
    landlord_email: string;
    residentsNum: number;
    bedsNum: number;
    mattressesNum: number;
    tablesNum: number;
    chairsNum: number;
  }>()
);
export const postHouseSuccess = createAction(
  '[HR] Post House Success',
  props<{ house: any }>()
);
export const postHouseFailure = createAction(
  '[HR] Post House Failure',
  props<{ error: any }>()
);

// Get facility report list
export const getFacilityReportList = createAction(
  '[HR] Get Facility Report List',
  props<{ id: string }>()
);
export const getFacilityReportListSuccess = createAction(
  '[HR] Get Facility Report List Success',
  props<{ reports: any[] }>()
);
export const getFacilityReportListFailure = createAction(
  '[HR] Get Facility Report List Failure',
  props<{ error: any }>()
);

// Post facility report comment
export const postFacilityReportComment = createAction(
  '[HR] Post Facility Report Comment',
  props<{ id: string; userId: string; description: string }>()
);
export const postFacilityReportCommentSuccess = createAction(
  '[HR] Post Facility Report Comment Success',
  props<{ comment: any }>()
);
export const postFacilityReportCommentFailure = createAction(
  '[HR] Post Facility Report Comment Failure',
  props<{ error: any }>()
);

// Put (update) facility report comment
export const putFacilityReportComment = createAction(
  '[HR] Put Facility Report Comment',
  props<{ id: string; description: string }>()
);
export const putFacilityReportCommentSuccess = createAction(
  '[HR] Put Facility Report Comment Success',
  props<{ comment: any }>()
);
export const putFacilityReportCommentFailure = createAction(
  '[HR] Put Facility Report Comment Failure',
  props<{ error: any }>()
);
