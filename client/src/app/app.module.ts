import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/employee/register-form/register-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PersonalInfoComponent } from './components/employee/personal-info/personal-info.component';
import { VisaStatusComponent } from './components/employee/visa-status/visa-status.component';
import { HousingComponent } from './components/employee/housing/housing.component';
import { NavbarEmployeeComponent } from './components/employee/navbar-employee/navbar-employee.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavbarHrComponent } from './components/hr/navbar-hr/navbar-hr.component';
import { EmployeeProfilesComponent } from './components/hr/employee-profiles/employee-profiles.component';
import { VisaStatusManagementComponent } from './components/hr/visa-status-management/visa-status-management.component';
import { HiringManagementComponent } from './components/hr/hiring-management/hiring-management.component';
import { HousingManagementComponent } from './components/hr/housing-management/housing-management.component';
import { EmployeeDetailComponent } from './components/hr/employee-detail/employee-detail.component';
import { HiringProfilesComponent } from './components/hr/hiring-profiles/hiring-profiles.component';
import { reducers } from './store/app.reducer';
import { effects } from './store/app.effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { OnboardingComponent } from './components/employee/onboarding/onboarding.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    RegisterFormComponent,
    PersonalInfoComponent,
    VisaStatusComponent,
    HousingComponent,
    NavbarEmployeeComponent,
    PageNotFoundComponent,
    NavbarComponent,
    NavbarHrComponent,
    EmployeeProfilesComponent,
    VisaStatusManagementComponent,
    HiringManagementComponent,
    HousingManagementComponent,
    EmployeeDetailComponent,
    HiringProfilesComponent,
    OnboardingComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    FlexLayoutModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    FormsModule,
    MatTooltipModule,
    FormsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
