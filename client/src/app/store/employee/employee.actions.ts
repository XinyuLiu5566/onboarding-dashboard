import { createAction, props } from '@ngrx/store';

export const loadPersonalInfo = createAction('[Employee] Load Personal Info');
export const loadPersonalInfoSuccess = createAction(
  '[Employee] Load Personal Info Success',
  props<{ personalInfo: any }>()
);
export const loadPersonalInfoFailure = createAction(
  '[Employee] Load Personal Info Failure',
  props<{ error: any }>()
);

export const loadVisaStatus = createAction('[Employee] Load Visa Status');
export const loadVisaStatusSuccess = createAction(
  '[Employee] Load Visa Status Success',
  props<{ visaStatus: any }>()
);
export const loadVisaStatusFailure = createAction(
  '[Employee] Load Visa Status Failure',
  props<{ error: any }>()
);

export const loadHouseInfo = createAction('[Employee] Load House Info');
export const loadHouseInfoSuccess = createAction(
  '[Employee] Load House Info Success',
  props<{ houseInfo: any }>()
);
export const loadHouseInfoFailure = createAction(
  '[Employee] Load House Info Failure',
  props<{ error: any }>()
);
export const submitFacilityReport = createAction(
  '[Report] Submit Facility Report',
  props<{ report: any }>()
);

export const submitFacilityReportFailure = createAction(
  '[Employee] Submit Facility Report Failure',
  props<{ error: any }>()
);

export const updateUserProfile = createAction(
  '[Employee] Update User Profile',
  props<{
    personalInfo: any;
    files: { profilePicture: File; workAuthFile: File; uploadedLicense: File };
  }>()
);

export const updateUserProfileSuccess = createAction(
  '[Employee] Update User Profile Success',
  props<{ updatedPersonalInfo: any }>()
);

export const updateUserProfileFailure = createAction(
  '[Employee] Update User Profile Failure',
  props<{ error: any }>()
);

export const register = createAction(
  '[Employee] Register',
  props<{ user: any }>()
);

export const registerSuccess = createAction('[Employee] Register Success');

export const registerFailure = createAction(
  '[Employee] Register Failure',
  props<{ error: any }>()
);

export const login = createAction(
  '[Employee] Login',
  props<{ credentials: any }>()
);

export const loginSuccess = createAction('[Employee] Login Success');

export const loginFailure = createAction(
  '[Employee] Login Failure',
  props<{ error: any }>()
);

export const saveEmail = createAction(
  '[Employee] Save Email',
  props<{ registeredEmail: string }>()
);

export const submitOnboardingForm = createAction(
  '[Employee] Submit Onboarding Form',
  props<{ onboardingForm: any }>()
);

export const submitOnboardingFormSuccess = createAction(
  '[Employee] Submit Onboarding Form Success',
  props<{ updatedOnboardingInfo: any }>()
);

export const submitOnboardingFormFailure = createAction(
  '[Employee] Submit Onboarding Form Failure',
  props<{ error: any }>()
);

export const uploadOptReceipt = createAction(
  '[Employee] Update OPT Receipt',
  props<{
    files: { optReceipt: File };
  }>()
);

export const uploadOptReceiptSuccess = createAction(
  '[Employee] Update OPT Receipt Success',
  props<{ updatedPersonalInfo: any; updatedVisaStatus: any }>()
);

export const uploadOptReceiptFailure = createAction(
  '[Employee] Update OPT Receipt Failure',
  props<{ error: any }>()
);
export const uploadOptEAD = createAction(
  '[Employee] Update OPT EAD',
  props<{
    files: { optEad: File };
  }>()
);

export const uploadOptEADSuccess = createAction(
  '[Employee] Update OPT EAD Success',
  props<{ updatedPersonalInfo: any; updatedVisaStatus: any }>()
);

export const uploadOptEADFailure = createAction(
  '[Employee] Update OPT EAD Failure',
  props<{ error: any }>()
);
export const uploadI20 = createAction(
  '[Employee] Update I20',
  props<{
    files: { i20: File };
  }>()
);

export const uploadI20Success = createAction(
  '[Employee] Update I20 Success',
  props<{ updatedPersonalInfo: any; updatedVisaStatus: any }>()
);

export const uploadI20Failure = createAction(
  '[Employee] Update I20 Failure',
  props<{ error: any }>()
);
export const uploadI983 = createAction(
  '[Employee] Update I983',
  props<{
    files: { i983: File };
  }>()
);

export const uploadI983Success = createAction(
  '[Employee] Update I983 Success',
  props<{ updatedPersonalInfo: any; updatedVisaStatus: any }>()
);

export const uploadI983Failure = createAction(
  '[Employee] Update I983 Failure',
  props<{ error: any }>()
);
