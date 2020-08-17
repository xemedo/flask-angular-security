import {Injectable} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Utility} from '../shared/utility';
import {catchError} from 'rxjs/operators';
import {tap} from 'rxjs/internal/operators/tap';

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

  login(form: NgForm): Observable<any> {
    return this.http.post<any>(Utility.getPath() + '/api/v1/login', {
      username: form.value.user,
      password: form.value.password
    });
  }

  register(form: NgForm): Observable<any> {
    return this.http.post<string>(Utility.getPath() + '/api/v1/register', {
      username: form.value.user,
      password: form.value.password,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email_address1: form.value.email_address1,
      email_address2: form.value.email_address2,
      phone_number: form.value.phone_number
    })
      .pipe(catchError(AuthService.handleError), tap(resData => {

      }));
  }

  logout(): any {

  }
}
