import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, tap, map } from 'rxjs/operators';
import { AppState } from '../../../store/app.state';
import { selectUserList } from '../../../store/hr/hr.selectors';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  user$: Observable<any | null>;
  private ngUnsubscribe = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {
    this.user$ = of([]);
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((params) => {
          const id = params['id']; // get id from the route parameters
          this.user$ = this.store.select(selectUserList).pipe(
            map((users) => users?.find((user) => user._id === id) || null) // find user with id
          );
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
