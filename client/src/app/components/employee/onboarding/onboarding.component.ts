import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject, combineLatest, of, takeUntil } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeState } from 'src/app/store/employee/employee.state';
import { Observable } from 'rxjs';
import {
  loadPersonalInfo,
  submitOnboardingForm,
  updateUserProfile,
} from '../../../store/employee/employee.actions';
import { AppState } from 'src/app/store/app.reducer';
import { Router } from '@angular/router';
import { selectPersonalInfo } from 'src/app/store/employee/employee.selectors';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  personalInfo$!: Observable<any>;
  onboardingForm$!: Observable<FormGroup>;
  profilePicture$!: Observable<File | undefined>;
  uploadedLicense$!: Observable<File | undefined>;
  workAuthFile$!: Observable<File | undefined>;
  onboardingStatus!: string | null;
  onboardingForm!: FormGroup;
  profilePicture!: File;
  uploadedLicense!: File;
  workAuthFile!: File;
  imagePreview!: string | ArrayBuffer;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.onboardingStatus = localStorage.getItem('onboardingStatus');

    this.personalInfo$ = this.store.select(
      (state) => state.employee.personalInfo
    );

    this.onboardingForm = this.fb.group({
      email: [{ value: '', disabled: true }], //need to get the registered email
      role: ['employee'],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      preferredName: [''],
      currentAddress: this.fb.group({
        building: ['', Validators.required],
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],
      }),
      cellPhoneNumber: ['', Validators.required],
      workPhoneNumber: [''],
      carInformation: this.fb.group({
        make: [''],
        model: [''],
        color: [''],
      }),
      ssn: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: [''],
      citizenStatus: this.fb.group({
        isCitizenOrPermanentResident: [null, Validators.required],
        greenCardOrCitizen: ['', Validators.required],
        workAuthorization: [''],
        otherVisaTitle: [''],
        startDate: [''],
        endDate: [''],
        optReceipt: this.fb.group({
          file: [''],
          status: ['Pending'],
          feedback: [''],
        }),
        optEad: this.fb.group({
          file: [''],
          status: ['Pending'],
          feedback: [''],
        }),
        i983: this.fb.group({
          file: [''],
          status: ['Pending'],
          feedback: [''],
        }),
        i20: this.fb.group({
          file: [''],
          status: ['Pending'],
          feedback: [''],
        }),
      }),
      hasDriverLicense: [null, Validators.required],
      driverLicense: this.fb.group({
        licenseNumber: ['', Validators.required],
        expirationDate: ['', Validators.required],
      }),
      reference: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        middleName: [''],
        phone: ['', Validators.required],
        email: ['', Validators.required],
        relationship: ['', Validators.required],
      }),
      emergencyContacts: this.fb.array([
        this.fb.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          middleName: [''],
          phone: ['', Validators.required],
          email: ['', Validators.required],
          relationship: ['', Validators.required],
        }),
      ]),
    });

    // get the registered email
    this.store
      .select(
        (state: { employee: EmployeeState }) => state.employee.registeredEmail
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((registeredEmail) => {
        const emailFormControl = this.onboardingForm?.get('email');
        if (emailFormControl) {
          emailFormControl.setValue(registeredEmail);
        }
      });

    this.personalInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((personalInfo) => {
        console.log('Personal Info:', personalInfo);
        if (personalInfo) {
          this.onboardingForm.patchValue(personalInfo);
        }
      });

    if (this.onboardingStatus === 'approved') {
      this.router.navigate(['/employee/personal-info']);
    } else if (this.onboardingStatus === 'pending') {
      this.onboardingForm.disable();
    } else if (this.onboardingStatus === 'rejected') {
      this.onboardingForm.enable();
    }

    this.store
      .select(
        (state: { employee: EmployeeState }) => state.employee.registeredEmail
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((registeredEmail) => {
        const emailFormControl = this.onboardingForm?.get('email');
        if (emailFormControl) {
          emailFormControl.setValue(registeredEmail);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get emergencyContacts(): FormArray {
    return this.onboardingForm.get('emergencyContacts') as FormArray;
  }

  addEmergencyContact(): void {
    this.emergencyContacts.push(
      this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        middleName: [''],
        phone: ['', Validators.required],
        email: ['', Validators.required],
        relationship: ['', Validators.required],
      })
    );
  }

  removeEmergencyContact(index: number): void {
    this.emergencyContacts.removeAt(index);
  }

  onFileChange(event: Event, field: String): void {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length) {
      const file = target.files[0];
      // Store the file in a separate property
      if (field === 'profilePicture') {
        this.profilePicture = file;
        this.previewProfilePicture(file);
      } else if (field === 'uploadedLicense') {
        this.uploadedLicense = file;
      } else if (field === 'workAuthFile') {
        this.workAuthFile = file;
      }
    }
  }

  previewProfilePicture(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  downloadFile(fileUrl: string, filename: string) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  }

  onSubmit(): void {
    if (this.onboardingForm.invalid) {
      alert('You must fill all required field');
      return;
    }

    if (
      this.onboardingStatus === 'not start' ||
      this.onboardingStatus === 'rejected'
    ) {
      const formData = new FormData();

      // Append the form fields to the FormData object
      Object.entries(this.onboardingForm.value).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (
            value instanceof Object &&
            !(value instanceof File) &&
            Object.keys(value).length > 0
          ) {
            formData.append(key, JSON.stringify(value));
          } else if (!(value instanceof Object)) {
            formData.append(key, value as string | Blob);
          }
        }
      });

      // Append the files to the FormData object
      if (this.profilePicture) {
        formData.append('profilePicture', this.profilePicture);
      }
      if (this.uploadedLicense) {
        formData.append('uploadedLicense', this.uploadedLicense);
      }
      if (this.workAuthFile) {
        formData.append('workAuthFile', this.workAuthFile);
      }

      // Dispatch the action
      this.store.dispatch(submitOnboardingForm({ onboardingForm: formData }));
    } else if (this.onboardingStatus === 'pending') {
      alert(
        'Your onboarding is pending approval. You cannot submit the form again at this time.'
      );
      return;
    }
  }
}
