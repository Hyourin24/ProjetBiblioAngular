import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookServiceService {

  private selectedBookIdSubject = new BehaviorSubject<string | null>(null);
  selectedBookId$ = this.selectedBookIdSubject.asObservable();

  setSelectedBookId(id: string) {
    this.selectedBookIdSubject.next(id);
  }

  getSelectedBookId(): string | null {
    return this.selectedBookIdSubject.getValue();
  }


  
}
