import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from './auth.service';
import {MustMatch} from '../shared/must-match.validator';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  errorMsg = null;
  requestSent = false;
  signupForm: FormGroup;
  loginForm: FormGroup;
  authenticated = false;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      user: ['', Validators.required],
      password_1: ['', [Validators.required]],
      password_2: ['', [Validators.required]],
      email_address1: ['', [Validators.required, Validators.email]],
      email_address2: ['', [Validators.required, Validators.email]]
    }, {
      validator: [
        MustMatch('password_1', 'password_2'),
        MustMatch('email_address1', 'email_address2')]
    });

    this.loginForm = this.formBuilder.group({
      user_login: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get fsu(): any {
    return this.signupForm.controls;
  }

  get fl(): any {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.requestSent = true;
    const form = this.isLoginMode ? this.loginForm : this.signupForm;

    if (!form.valid) {
      return;
    }

    this.errorMsg = null;
    let authObs: Observable<any>;

    if (this.isLoginMode) {
      authObs = this.authService.login(form);
    } else {
      authObs = this.authService.register(form);
    }

    authObs.subscribe(responseData => {
      this.errorMsg = '';
      this.authenticated = true;
    }, error => {
      this.errorMsg = error;
      this.authenticated = false;
    });
  }

  toggleAuth(): void {
    this.requestSent = false;
    this.isLoginMode = !this.isLoginMode;
  }
}
