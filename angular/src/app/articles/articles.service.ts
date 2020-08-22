import {Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ArticlesService {
  public articles: string[] = new Array();
  public articlesChanged = new Subject<string[]>();

  constructor(private http: HttpClient) {
  }

  addArticle(text: string): Observable<any> {
    const formData: any = new FormData();
    formData.append('content', text);

    return this.http.post<any>('/api/v1/articles', formData)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.articles.push(text);
          this.articlesChanged.next(this.articles.slice());
        })
      );
  }

  fetchArticles(): void {
    this.http.get<any>('/api/v1/articles').subscribe(articles => {
      articles.response.data.map(article => {
        this.articles.push(article.content);
      });
      this.articlesChanged.next(this.articles);
    });
  }

  private handleError(errorRes: HttpErrorResponse): Observable<any> {
    const errorMessage = 'An unknown error occurred!';
    if (!errorRes.error ||
      !errorRes.error.content) {
      return throwError(errorMessage);
    }

    return throwError(errorRes.error.content);
  }
}
