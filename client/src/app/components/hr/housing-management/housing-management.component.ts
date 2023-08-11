import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

import * as HrActions from '../../../store/hr/hr.actions';
import { selectHouses, selectError } from '../../../store/hr/hr.selectors';

@Component({
  selector: 'app-housing-management',
  templateUrl: './housing-management.component.html',
  styleUrls: ['./housing-management.component.scss'],
})
export class HousingManagementComponent implements OnInit {
  houses$: Observable<any[]>;
  error$: Observable<string | null>;
  newHouseForm: FormGroup;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.houses$ = of();
    this.error$ = of();
    this.newHouseForm = this.formBuilder.group({
      addressStreet: [''],
      addressCity: [''],
      addressState: [''],
      addressZipcode: [''],
      landlordName: [''],
      landlordPhone: [''],
      landlord_email: [''],
      residentsNum: [''],
      bedsNum: [''],
      mattressesNum: [''],
      tablesNum: [''],
      chairsNum: [''],
    });
  }

  ngOnInit() {
    this.houses$ = this.store.select(selectHouses);
    this.error$ = this.store.select(selectError);

    this.store.dispatch(HrActions.getHouseList());
  }

  addHouse() {
    if (this.newHouseForm.valid) {
      this.store.dispatch(HrActions.postHouse(this.newHouseForm.value));
      this.store.dispatch(HrActions.getHouseList());
      this.newHouseForm.reset();
      this.houses$ = this.store.select(selectHouses);
    }
  }
}
