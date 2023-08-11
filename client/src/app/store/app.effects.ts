import { EmployeeEffects } from './employee/employee.effects';
import { HrEffects } from './hr/hr.effects';

export const effects: any[] = [EmployeeEffects, HrEffects];

export * from './employee/employee.effects';
export * from './hr/hr.effects';
