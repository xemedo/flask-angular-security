import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {AuthService} from './auth/auth.service';
import {MustMatch} from './shared/must-match.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  isLoginMode = true;
  errorMsg = null;
  requestSent = false;
  signupForm: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      user: ['', Validators.required],
      password_1: ['', [Validators.required, Validators.minLength(8)]],
      password_2: ['', [Validators.required]],
      email_address1: ['', [Validators.required, Validators.email]],
      email_address2: ['', [Validators.required, Validators.email]]
    }, {
      validator: [
        MustMatch('password_1', 'password_2'),
        MustMatch('email_address1', 'email_address2')]
    });
  }

  // convenience getter for easy access to form fields
  get f(): any {
    return this.signupForm.controls;
  }

  onSubmit(): void {
    this.requestSent = true;
    if (!this.signupForm.valid) {
      return;
    }

    this.errorMsg = null;
    let authObs: Observable<any>;

    if (this.isLoginMode) {
      authObs = this.authService.login(this.signupForm);
    } else {
      authObs = this.authService.register(this.signupForm);
    }

    authObs.subscribe(responseData => {
      this.errorMsg = '';
      console.log(responseData);
    }, error => {
      this.errorMsg = error;
    });

    this.signupForm.reset();
  }

  toggleAuth(): void {
    this.requestSent = false;
    this.isLoginMode = !this.isLoginMode;
  }
}
