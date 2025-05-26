import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../modules/User';
import { Book } from '../modules/Book';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  getUser() {
    return this.http.get<User[]>(`${this.api_url}/api/users`, { withCredentials: true });
  }

    private api_url = 'http://localhost:3000';
    constructor(private http: HttpClient) { }

   connexion(body: any): Observable<any> {
    return this.http.post<any>(`${this.api_url}/api/auth/login`, body, { withCredentials: true });
  }

  inscription(body: any): Observable<any> {
    return this.http.post<any>(`${this.api_url}/api/auth/register`, body, { withCredentials: true });
  }

  getBooksActive() {
    return this.http.get<Book[]>(`${this.api_url}/api/books/active`, { withCredentials: true });
  }

  getBooksById(bookId: string) {
    return this.http.get<Book>(`${this.api_url}/api/books/${bookId}`, { withCredentials: true });
  }
}
