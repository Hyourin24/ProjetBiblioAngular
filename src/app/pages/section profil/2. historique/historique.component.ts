import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Book } from '../../../modules/Book';
import { forkJoin } from 'rxjs';
import { User } from '../../../modules/User';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventBook } from '../../../modules/Event';

@Component({
  selector: 'app-historique',
  imports: [CommonModule, FormsModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent {
  userId: string = "";
 
  
  bookList: Book[] = [];
  bookClick = ""
  book = new Array<Book>();
  bookReserved: Book[] = [];
  bookRead: Book[] = [];
  eventReserved: EventBook[] = [];

  idClick: string | null = null;


  constructor(private router: Router, private route: ActivatedRoute,  private httpTestService: ApiService) { }

  ngOnInit() {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
  
    if (!token || !userData) {
      this.router.navigate(['/login']);
      console.log('⛔ Pas de token ou user, accès refusé');
      return;
    }
  
    const userParsed = JSON.parse(userData);
    this.userId = userParsed._id;
    const reservedBooks = userParsed.bookReserved || [];
    const reservedEvents = userParsed.eventReserved || [];
    const readBooks = userParsed.booksRead || [];
    
  
    forkJoin({
      bookJoin: this.httpTestService.getBooksActive()
    }).subscribe(({ bookJoin }) => {
      this.bookReserved = bookJoin.filter(book => reservedBooks.includes(book._id));
      this.bookRead = bookJoin.filter(book => readBooks.includes(book._id));
      console.log('📚 Livres réservés :', this.bookReserved);
      console.log('📘 Livres en ma possession :', this.bookRead);
    });
    

    forkJoin({
      eventJoin: this.httpTestService.getEvent()
    }).subscribe(({ eventJoin }) => {
      // Filtre tous les événements dont l'ID est dans eventReserved
      this.eventReserved = eventJoin.filter((event: { _id: any; }) => reservedEvents.includes(event._id));
      console.log('📅 Events Réservés:', this.eventReserved)
    });
  }

  clickBook(bookId: string) {
    console.log("Book cliqué :", bookId);
    // this.bookService.setSelectedBook(book);
    this.router.navigate(['/book', bookId]);
  }
  
}

  


