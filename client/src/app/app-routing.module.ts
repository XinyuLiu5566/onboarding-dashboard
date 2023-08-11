import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterFormComponent } from './components/employee/register-form/register-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { PersonalInfoComponent } from './components/employee/personal-info/personal-info.component';
import { VisaStatusComponent } from './components/employee/visa-status/visa-status.component';
import { HousingComponent } from './components/employee/housing/housing.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AuthGuardGuard } from './auth-guard.guard';
import { EmployeeProfilesComponent } from './components/hr/employee-profiles/employee-profiles.component';
import { VisaStatusManagementComponent } from './components/hr/visa-status-management/visa-status-management.component';
import { HiringManagementComponent } from './components/hr/hiring-management/hiring-management.component';
import { HousingManagementComponent } from './components/hr/housing-management/housing-management.component';
import { EmployeeDetailComponent } from './components/hr/employee-detail/employee-detail.component';
import { HiringProfilesComponent } from './components/hr/hiring-profiles/hiring-profiles.component';
import { OnboardingComponent } from './components/employee/onboarding/onboarding.component';

const routes: Routes = [
  { path: 'register', component: RegisterFormComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'onboarding', component: OnboardingComponent },
  {
    path: 'employee/personal-info',
    component: PersonalInfoComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'employee/visa-status',
    component: VisaStatusComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'employee/housing',
    component: HousingComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'hr/employee-profiles',
    component: EmployeeProfilesComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'hr/employee-profiles/:id',
    component: EmployeeDetailComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'hr/visa-status-management',
    component: VisaStatusManagementComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'hr/hiring-management',
    component: HiringManagementComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'hr/hiring-profiles/:id',
    component: HiringProfilesComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'hr/housing-management',
    component: HousingManagementComponent,
    canActivate: [AuthGuardGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
