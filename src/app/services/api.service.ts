import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../modules/User';
import { Book } from '../modules/Book';
import { CommentBook } from '../modules/CommentBook';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api_url = 'http://localhost:3000';
  constructor(private http: HttpClient) { }
  
  getUser() {
    return this.http.get<User[]>(`${this.api_url}/api/users`, { withCredentials: true });
  }

  getUserById(userId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<User>(`${this.api_url}/api/users/${userId}`, { headers, withCredentials: true });
  }

   connexion(body: any): Observable<any> {
    return this.http.post<any>(`${this.api_url}/api/auth/login`, body, { withCredentials: true });
  }
  deconnexion(): Observable<any> {
    return this.http.post<any>(`${this.api_url}/api/auth/logout`, {}, { withCredentials: true });
  }
  inscription(body: any): Observable<any> {
    return this.http.post<any>(`${this.api_url}/api/auth/register`, body, { withCredentials: true });
  }

  getBooksActive() {
    return this.http.get<Book[]>(`${this.api_url}/api/books/active`, { withCredentials: true });
  }

  getBooksById(bookId: any) {
    return this.http.get<Book>(`${this.api_url}/api/books/${bookId}`, { withCredentials: true });
  }

  getEvent(): Observable<any> {
    return this.http.get<any>(`${this.api_url}/api/events`, { withCredentials: true });
  }
  getCommentsByBook(bookId: string) {
    return this.http.get<CommentBook[]>(`${this.api_url}/api/comments/${bookId}`, { withCredentials: true });
  }

  postCommentBook(bookId: string, body: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in localStorage');
    }
    return this.http.post<CommentBook[]>(`${this.api_url}/api/comments/${bookId}`, body, { withCredentials: true })
  }
  postReservedBook(bookId: string, userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in localStorage');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<Book>(`${this.api_url}/api/users/${userId}/reservedBooks/${bookId}`, { headers }, { withCredentials: true});
  }

  postEventBook(eventId: string, userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in localStorage');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<Event>(`${this.api_url}/api/users/${userId}/reservedEvents/${eventId}`, { headers }, { withCredentials: true });
  }

  postBook(body: any): Observable<any> {
    return this.http.post<Book>(`${this.api_url}/api/books`, body, { withCredentials: true });
  }
  
  updateUser(userId: string, body: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in localStorage');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put<any>(`${this.api_url}/api/users/${userId}`, body, { headers, withCredentials: true });
  }

  deleteBook(bookId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete(`${this.api_url}/api/books/${bookId}`, { headers, withCredentials: true });
  }
}
