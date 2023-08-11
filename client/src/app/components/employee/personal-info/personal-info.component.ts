import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  loadPersonalInfo,
  updateUserProfile,
} from '../../../store/employee/employee.actions';
import { AppState } from 'src/app/store/app.reducer';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  personalInfo$!: Observable<any>;
  editingPersonalInfo: any;

  editing = false;
  profilePicture: File | null = null;
  uploadedLicense: File | null = null;
  workAuthFile: File | null = null;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadPersonalInfo());

    this.personalInfo$ = this.store.select(
      (state) => state.employee.personalInfo
    );
    this.personalInfo$.subscribe((personalInfo) => {
      this.editingPersonalInfo = cloneDeep(personalInfo);
    });
  }

  onFileChange(event: any, type: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      switch (type) {
        case 'profilePicture':
          this.profilePicture = file;
          break;
        case 'uploadedLicense':
          this.uploadedLicense = file;
          break;
        case 'workAuthFile':
          this.workAuthFile = file;
          break;
        default:
          break;
      }
    }
  }

  startEditing(): void {
    this.editing = true;
  }

  cancelEditing(): void {
    if (confirm('Do you want to discard all changes?')) {
      this.editing = false;
      this.store.dispatch(loadPersonalInfo());
    }
  }

  saveChanges(editingPersonalInfo: any): void {
    this.editing = false;
    const placeholderFile = new File([], '');

    let files = {
      profilePicture: this.profilePicture || placeholderFile,
      workAuthFile: this.workAuthFile || placeholderFile,
      uploadedLicense: this.uploadedLicense || placeholderFile,
    };
    this.store.dispatch(
      updateUserProfile({ personalInfo: editingPersonalInfo, files })
    );
  }
}
