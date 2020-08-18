import {Injectable} from '@angular/core';
import {Utility} from '../shared/utility';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ArticlesService {
  constructor(private http: HttpClient){

  }

  addArticle(): Observable<any> {
    return this.http.post<any>(Utility.getPath() + '/articles', {
      content: 'asdf'
    })
      .pipe(
        catchError(this.handleError)
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
