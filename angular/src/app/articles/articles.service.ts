import {Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ArticlesService {
  constructor(private http: HttpClient) {

  }

  addArticle(): Observable<any> {
    const formData: any = new FormData();
    formData.append('content', 'asfffdadsf');

    return this.http.post<any>('/api/v1/articles', formData)
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
