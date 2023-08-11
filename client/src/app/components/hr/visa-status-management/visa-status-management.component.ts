import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { HrState } from '../../../store/hr/hr.state';
import * as HrActions from '../../../store/hr/hr.actions';
import {
  selectVisaStatusList,
  selectOptReceiptStatus,
  selectOptEadStatus,
  selectI983Status,
  selectI20Status,
} from '../../../store/hr/hr.selectors';

@Component({
  selector: 'app-visa-status-management',
  templateUrl: './visa-status-management.component.html',
  styleUrls: ['./visa-status-management.component.scss'],
})
export class VisaStatusManagementComponent implements OnInit {
  visaStatusList$: Observable<any[]>;
  filteredVisaStatusList$: Observable<any[]>;
  optReceiptStatus$: Observable<any[]>;
  optEadStatus$: Observable<any[]>;
  i983Status$: Observable<any[]>;
  i20Status$: Observable<any[]>;
  feedback: string = '';
  searchControl = new FormControl();

  constructor(private store: Store<{ hr: HrState }>) {
    this.visaStatusList$ = this.store.pipe(select(selectVisaStatusList));
    this.optReceiptStatus$ = this.store.pipe(select(selectOptReceiptStatus));
    this.optEadStatus$ = this.store.pipe(select(selectOptEadStatus));
    this.i983Status$ = this.store.pipe(select(selectI983Status));
    this.i20Status$ = this.store.pipe(select(selectI20Status));
    this.filteredVisaStatusList$ = of([]);
  }

  ngOnInit() {
    this.store.dispatch(HrActions.getVisaStatusList());

    this.visaStatusList$.pipe().subscribe((visaStatusList) => {
      console.log(visaStatusList);
      this.filteredVisaStatusList$ = this.visaStatusList$.pipe(
        map((visaStatusList) => this.filterUsers(visaStatusList))
      );
    });

    this.searchControl.valueChanges
      .pipe(
        tap((value) => {
          this.filteredVisaStatusList$ = this.visaStatusList$.pipe(
            map((visaStatusList) => {
              const filter = this.filterUsers(visaStatusList, value);
              console.log(filter);
              return filter;
            })
          );
        })
      )
      .subscribe();
  }

  updateOptReceiptStatus(
    userId: string,
    optReceiptStatus: string,
    feedback: string
  ) {
    // Dispatch action to update OPT EAD status
    this.store.dispatch(
      HrActions.updateOptReceipt({ id: userId, optReceiptStatus, feedback })
    );
  }

  updateOptEadStatus(userId: string, optEadStatus: string, feedback: string) {
    // Dispatch action to update OPT EAD status
    this.store.dispatch(
      HrActions.updateOptEad({ id: userId, optEadStatus, feedback })
    );
  }

  updateI983Status(userId: string, i983Status: string, feedback: string) {
    // Dispatch action to update I-983 status
    this.store.dispatch(
      HrActions.updateI983({ id: userId, i983Status, feedback })
    );
  }

  updateI20Status(userId: string, i20Status: string, feedback: string) {
    // Dispatch action to update I-20 status
    this.store.dispatch(
      HrActions.updateI20({ id: userId, i20Status, feedback })
    );
  }

  sendNotification(userId: string) {
    // Dispatch action to send notification
  }

  getRemainingDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMilliSeconds = Math.abs(end.getTime() - start.getTime());
    const diffInDays = Math.ceil(diffInMilliSeconds / (1000 * 60 * 60 * 24));
    return diffInDays;
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
}
