import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../modules/Book';

@Injectable({
  providedIn: 'root'
})
export class BookServiceService {

  private selectedBookSubject = new BehaviorSubject<Book | null>(null);
  selectedBook$ = this.selectedBookSubject.asObservable();
  
  setSelectedBook(bookResponse: any) {
    this.selectedBookSubject.next(bookResponse.data);
  }
  
  getSelectedBook(): Book | null {
    return this.selectedBookSubject.getValue();
  }
  

  
}
