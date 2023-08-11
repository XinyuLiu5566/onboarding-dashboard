export interface EmployeeState {
  personalInfo: any;
  visaStatus: any;
  houseInfo: any;
  registeredEmail?: string | null;
  error: any;
}

export const initialState: EmployeeState = {
  personalInfo: null,
  visaStatus: null,
  houseInfo: null,
  registeredEmail: null,
  error: null,
};
