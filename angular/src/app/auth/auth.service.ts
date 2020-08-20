import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable, Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, take} from 'rxjs/operators';
import {tap} from 'rxjs/internal/operators/tap';
import {Router} from '@angular/router';
import {UserModel} from '../model/UserModel';

@Injectable({providedIn: 'root'})
export class AuthService {

  authenticationChanged = new Subject();
  constructor(private http: HttpClient, private router: Router) {
  }

  private handleAuthentication(): void {
    window.setTimeout(x => {
      this.authenticationChanged.next();
      this.router.navigate(['/articles']);
    }, 2000);

  }

  login(form: FormGroup): Observable<any> {
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

  logout(): Observable<any> {
    return this.http.post<any>('/api/v1/logout', {})
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.authenticationChanged.next();
          this.router.navigate(['/']);
        })
      );
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

  getAuthenticatedUser(): Observable<UserModel>  {
    return this.http.get<any>('/api/v1/users/current', {})
      .pipe(
        catchError(this.handleError),
        take(1),
        map(response => {
          return new UserModel(response.user_id, response.username, response.email);
        })
      );
  }

  private handleError(errorRes: HttpErrorResponse): Observable<any> {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error ||
      !errorRes.error.response) {
      return throwError(errorMessage);
    }

    if (errorRes.error.response.error) {
      return throwError(errorRes.error.response.error);

    } else if (errorRes.error.response.errors) {

      const errorObj = errorRes.error.response.errors;

      for (const prop in errorObj) {
        if (errorObj.hasOwnProperty(prop)) {
          errorMessage = errorObj[prop];
        }
      }
    }

    return throwError(errorMessage);
  }
}
