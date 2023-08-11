export interface HrState {
  loggedIn: boolean;
  userList: any[];
  visaStatusList: any[];
  applications: any[];
  houses: any[];
  reports: any[];
  error: any;
}

export const initialState: HrState = {
  loggedIn: false,
  userList: [],
  visaStatusList: [],
  applications: [],
  houses: [],
  reports: [],
  error: null,
};
