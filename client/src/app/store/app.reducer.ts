import { ActionReducerMap } from '@ngrx/store';
import { employeeReducer } from './employee/employee.reducer';
import { EmployeeState } from './employee/employee.state';
import { HrState } from './hr/hr.state';
import { hrReducer } from './hr/hr.reducer';

export interface AppState {
  employee: EmployeeState;
  hr: HrState;
  // Other state go here
}

export const reducers: ActionReducerMap<AppState> = {
  employee: employeeReducer,
  hr: hrReducer,
  // Other reducers go here
};
