import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, tap, startWith, map } from 'rxjs/operators';
import * as HrActions from '../../../store/hr/hr.actions';
import { AppState } from '../../../store/app.state';
import { selectUserList } from '../../../store/hr/hr.selectors';

@Component({
  selector: 'app-employee-profiles',
  templateUrl: './employee-profiles.component.html',
  styleUrls: ['./employee-profiles.component.scss'],
})
export class EmployeeProfilesComponent implements OnInit, OnDestroy {
  userList$: Observable<any[] | null>;
  filteredUsers$: Observable<any[] | null>;
  searchControl = new FormControl();
  private ngUnsubscribe = new Subject<void>();
  displayedColumns: string[] = [
    'name',
    'preferredName',
    'ssn',
    'authorization',
    'phone',
    'email',
    'action',
  ];

  dataSource: any[] = [];

  constructor(private store: Store<AppState>, private router: Router) {
    this.userList$ = this.store.select(selectUserList);
    this.filteredUsers$ = of([]);
  }

  ngOnInit(): void {
    this.store.dispatch(HrActions.getUserList());

    this.userList$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((userList) => {
      this.filteredUsers$ = this.userList$.pipe(
        map((userList) => this.filterUsers(userList))
      );
    });

    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((value) => {
          this.filteredUsers$ = this.userList$.pipe(
            map((userList) => {
              const filter = this.filterUsers(userList, value);
              return filter;
            })
          );
        })
      )
      .subscribe();
  }

  filterUsers(users: any[] | null, value: string = ''): any[] {
    //return users || [];
    return (
      users?.filter(
        (user) =>
          (user.firstName &&
            user.firstName.toLowerCase().includes(value.toLowerCase())) ||
          (user.lastName &&
            user.lastName.toLowerCase().includes(value.toLowerCase())) ||
          (user.preferredName &&
            user.preferredName.toLowerCase().includes(value.toLowerCase()))
      ) || []
    );
  }

  openUserProfile(id: string): void {
    this.router.navigate(['hr/employee-profiles/', id]);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
