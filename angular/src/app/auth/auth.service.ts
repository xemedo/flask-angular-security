import {Injectable} from '@angular/core';
import {FormGroup, NgForm} from '@angular/forms';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Utility} from '../shared/utility';
import {catchError} from 'rxjs/operators';
import {tap} from 'rxjs/internal/operators/tap';
import {Router} from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AuthService {
  public user = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
  }

  private handleAuthentication(): void {
    window.setTimeout(x => {
      this.user.next(true);
      this.router.navigate(['/articles']);
    }, 2000);

  }

  login(form: FormGroup): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<any>('/api/v1/login', {
      username: form.value.user_login,
      password: form.value.password
    })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication();
        })
      );
  }

  logout(): void {
    this.http.post<any>('/api/v1/logout', {})
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.user.next(false);
          this.router.navigate(['/']);
        })
      ).subscribe();
  }

  register(form: FormGroup): Observable<any> {
    return this.http.post<string>('/api/v1/register', {
      username: form.value.user,
      password: form.value.password_1,
      email: form.value.email_address1
    })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication();
        })
      );
  }

  private handleError(errorRes: HttpErrorResponse): Observable<any> {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error ||
      !errorRes.error.response ||
      !errorRes.error.response.errors) {
      return throwError(errorMessage);
    }

    const errorObj = errorRes.error.response.errors;

    for (const prop in errorObj) {
      if (errorObj.hasOwnProperty(prop)) {
        errorMessage = errorObj[prop];
      }
    }

    return throwError(errorMessage);
  }
}
