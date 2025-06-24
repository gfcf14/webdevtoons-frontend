import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenResponse } from "../../models/post/post.model";
import { API_BASE_URL } from "../../app/app.config";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private baseUrl: string = inject(API_BASE_URL);
  private loginUrl: string = `${this.baseUrl}/login`;

  login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.loginUrl}`, {
      username,
      password
    });
  }
}