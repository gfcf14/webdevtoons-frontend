import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Post, TokenResponse } from "../../models/post/post.model";
import { API_BASE_URL } from "../../app/app.config";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private baseUrl: string = inject(API_BASE_URL);
  private apiUrl: string = `${this.baseUrl}/posts`;
  private loginUrl: string = `${this.baseUrl}/login`;

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostByDate(date: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${date}`);
  }

  createPost(post: Post, headers: HttpHeaders): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post, { headers });
  }

  login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.loginUrl}`, {
      username,
      password
    });
  }
}