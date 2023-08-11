import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import {
  loadHouseInfo,
  submitFacilityReport,
} from '../../../store/employee/employee.actions';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-housing',
  templateUrl: './housing.component.html',
  styleUrls: ['./housing.component.scss'],
})
export class HousingComponent implements OnInit {
  houseInfo$!: Observable<any | null>;
  facilityReports$!: Observable<any[]>;
  reportForm!: FormGroup;
  fullAddress$!: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.store.dispatch(loadHouseInfo());
    this.houseInfo$ = this.store.select((state) => state.employee.houseInfo);
    this.facilityReports$ = this.houseInfo$.pipe(
      map((houseInfo) => (houseInfo ? houseInfo.facilityReports : []))
    );
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      this.store.dispatch(
        submitFacilityReport({ report: this.reportForm.value })
      );
      this.reportForm.reset();
    }
  }
}
