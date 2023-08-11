import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import { HrState } from '../../../store/hr/hr.state';
import { selectApplications } from '../../../store/hr/hr.selectors';
import * as HrActions from '../../../store/hr/hr.actions';

@Component({
  selector: 'app-hiring-profiles',
  templateUrl: './hiring-profiles.component.html',
  styleUrls: ['./hiring-profiles.component.scss'],
})
export class HiringProfilesComponent implements OnInit {
  applications$: Observable<any[]>;
  user$: Observable<any>;
  feedback: string = '';

  constructor(private store: Store<HrState>, private route: ActivatedRoute) {
    this.applications$ = of();
    this.user$ = of();
  }

  ngOnInit() {
    this.store.dispatch(HrActions.loadApplications());
    this.applications$ = this.store.select(selectApplications);
    this.user$ = this.route.params.pipe(
      switchMap((params) => {
        return this.applications$.pipe(
          map((applications) => {
            const user = applications.find((app) => app._id === params['id']);
            return user;
          })
        );
      })
    );
  }

  changeStatus(id: number, status: string, feedback: string) {
    this.store.dispatch(
      HrActions.changeApplicationStatus({ id, status, feedback })
    );
    console.log('status: ', status);
    this.feedback = '';
  }
}
