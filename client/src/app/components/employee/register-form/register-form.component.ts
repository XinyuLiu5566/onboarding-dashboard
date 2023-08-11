import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as UserActions from '../../../store/employee/employee.actions';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['employee'],
  });

  constructor(private fb: FormBuilder, private store: Store) {}

  onSubmit(): void {
    if (this.registerForm.invalid) {
      alert('All fields are required!');
      return;
    } else {
      this.store.dispatch(
        UserActions.register({ user: this.registerForm.value })
      );
    }
  }
}
