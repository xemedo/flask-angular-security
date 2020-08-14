import {Injectable} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(form: NgForm): Observable<any> {
    return this.http.post<any>('/api/v1/login', {
      username: form.value.user,
      password: form.value.password
    });
  }
}
