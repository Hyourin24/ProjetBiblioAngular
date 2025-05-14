import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    private api_url = 'http://localhost:3000';
    constructor(private http: HttpClient) { }

   connexion(body: any): Observable<any> {
    return this.http.post<any>(`${this.api_url}/api/login`, body, { withCredentials: true });
  }
}
