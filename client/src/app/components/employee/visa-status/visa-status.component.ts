import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  loadVisaStatus,
  uploadOptReceipt,
  uploadI20,
  uploadI983,
  uploadOptEAD,
} from '../../../store/employee/employee.actions';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-visa-status',
  templateUrl: './visa-status.component.html',
  styleUrls: ['./visa-status.component.scss'],
})
export class VisaStatusComponent implements OnInit {
  visaStatus$!: Observable<any>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadVisaStatus());
    this.visaStatus$ = this.store.select((state) => state.employee.visaStatus);
  }

  onOptReceiptFileChange(event: any) {
    const file = event.target.files[0];
    this.store.dispatch(
      uploadOptReceipt({
        files: {
          optReceipt: file,
        },
      })
    );
  }

  onOptEADFileChange(event: any) {
    const file = event.target.files[0];
    this.store.dispatch(
      uploadOptEAD({
        files: {
          optEad: file,
        },
      })
    );
  }

  onI983FileChange(event: any) {
    const file = event.target.files[0];
    this.store.dispatch(
      uploadI983({
        files: {
          i983: file,
        },
      })
    );
  }

  onI20FileChange(event: any) {
    const file = event.target.files[0];
    this.store.dispatch(
      uploadI20({
        files: {
          i20: file,
        },
      })
    );
  }
}
