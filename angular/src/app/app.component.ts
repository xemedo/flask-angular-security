import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'angular-fe';
  isLoginMode = true;
  errorMsg = null;

  constructor(private authService: AuthService) {

  }

  onSubmit(form: NgForm): void {
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
      console.log(responseData);
    }, error => {
      this.errorMsg = error;
    });

    form.reset();
  }

  switchToRegistration(): void {
    this.isLoginMode = false;
  }
}
