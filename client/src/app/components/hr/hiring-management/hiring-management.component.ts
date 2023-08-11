import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HrState } from '../../../store/hr/hr.state';
import { selectApplications } from '../../../store/hr/hr.selectors';
import * as HrActions from '../../../store/hr/hr.actions';

@Component({
  selector: 'app-hiring-management',
  templateUrl: './hiring-management.component.html',
  styleUrls: ['./hiring-management.component.scss'],
})
export class HiringManagementComponent implements OnInit {
  applications$: Observable<any[]>;
  pendingApplications$: Observable<any[]>;
  rejectedApplications$: Observable<any[]>;
  approvedApplications$: Observable<any[]>;
  email: string = '';
  name: string = '';

  constructor(private store: Store<HrState>, private router: Router) {
    this.applications$ = of();
    this.pendingApplications$ = of();
    this.rejectedApplications$ = of();
    this.approvedApplications$ = of();
  }

  ngOnInit() {
    this.store.dispatch(HrActions.loadApplications());
    this.applications$ = this.store.select(selectApplications);
    this.pendingApplications$ = this.applications$.pipe(
      map((applications) => {
        console.log('applications', applications);
        const stuff = applications.filter(
          (app) => app.isApproved === 'pending'
        );
        console.log('pending', stuff);
        return stuff;
      })
    );
    this.rejectedApplications$ = this.applications$.pipe(
      map((applications) =>
        applications.filter((app) => app.isApproved === 'denied')
      )
    );
    this.approvedApplications$ = this.applications$.pipe(
      map((applications) =>
        applications.filter((app) => app.isApproved === 'approved')
      )
    );
  }

  viewApplication(id: string) {
    this.router.navigate(['hr/hiring-profiles/', id]);
  }

  onGenerateTokenAndSendEmail(email: string, name: string): void {
    this.email = '';
    this.name = '';
    this.store.dispatch(HrActions.generateTokenAndSendEmail({ email, name }));
  }
}
