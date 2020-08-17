import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  isLoginMode = true;
  errorMsg = null;

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
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

  toggleAuth(): void {
    this.isLoginMode = !this.isLoginMode;
  }
}
