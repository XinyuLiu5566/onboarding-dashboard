import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { login } from '../../store/employee/employee.actions';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  loginForm = this.fb.group({
    usernameOrEmail: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(private fb: FormBuilder, private store: Store) {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      alert('All fields are required!');
      return;
    } else {
      this.store.dispatch(login({ credentials: this.loginForm.value }));
    }
  }
}
