import {Injectable} from '@angular/core';
import {FormGroup, NgForm} from '@angular/forms';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Utility} from '../shared/utility';
import {catchError} from 'rxjs/operators';
import {tap} from 'rxjs/internal/operators/tap';
import {error} from 'selenium-webdriver';

@Injectable({providedIn: 'root'})
export class AuthService {
  public isAuthenticated = false;

  constructor(private http: HttpClient) {
  }

  private static handleError(errorRes: HttpErrorResponse): Observable<any> {
    const errorMessage = 'An unknown error occurred!';
    if (!errorRes.error) {
      return throwError(errorMessage);
    } else {
      return throwError(errorRes.error);
    }
  }

  login(form: FormGroup): Observable<any> {
    return this.http.post<any>(Utility.getPath() + '/login', {
      username: form.value.user,
      password: form.value.password
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  register(form: FormGroup): Observable<any> {
    return this.http.post<string>(Utility.getPath() + '/register', {
      username: form.value.user,
      password: form.value.password_1,
      email: form.value.email_address1
    })
      .pipe(catchError(AuthService.handleError), tap(resData => {

      }));
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
