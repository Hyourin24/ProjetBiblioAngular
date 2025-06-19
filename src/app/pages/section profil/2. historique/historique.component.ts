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
 
  bookId: string = ""
  bookList: Book[] = [];
  bookClick = ""
  book = new Array<Book>();
  bookReserved: Book[] = [];
  bookRead: Book[] = [];
  eventReserved: EventBook[] = [];

  idClick: string | null = null;
  isLoggedIn: boolean = false;


  constructor(private router: Router, private route: ActivatedRoute,  private httpTestService: ApiService) { }

  ngOnInit() {
    this.checkAuth();
  
    const userId = localStorage.getItem('user');
    if (!userId) {
      console.error('❌ Pas dID utilisateur trouvé dans le localStorage.');
      return;
    }
  
    this.userId = userId;
  
    this.httpTestService.getUserById(this.userId).subscribe(user => {
      console.log(user)
      const reservedBooks = user.bookReserved || [];
      const readBooks = user.booksRead || [];
      const reservedEvents = user.eventReserved || [];
      console.log('livres réservés: ', reservedBooks)
      console.log('livres lu', user.booksRead)
  
      // 📚 On récupère les livres actifs pour filtrer ceux du user
      this.httpTestService.getBooksActive().subscribe(bookJoin => {
        this.bookReserved = bookJoin.filter(book => reservedBooks.includes(book._id));
        this.bookRead = bookJoin.filter(book => readBooks.includes(book._id));
        console.log('📚 Livres réservés :', this.bookReserved);
        console.log('📘 Livres en ma possession :', this.bookRead);
      });
  
      // 📅 On récupère les events
      this.httpTestService.getEvent().subscribe(eventJoin => {
        this.eventReserved = eventJoin.filter((event: { _id: string; }) => reservedEvents.includes(event._id));
        console.log('📅 Events Réservés:', this.eventReserved);
      });
    });
  }
  

  clickBook(bookId: string) {
    console.log("Book cliqué :", bookId);
    // this.bookService.setSelectedBook(book);
    this.router.navigate(['/book', bookId]);
  }

  checkAuth(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    if (!token) {
      this.router.navigate(['/login']);
      console.log('⛔ Pas de token ou user, accès refusé');
      return;
    }
  }
  
}

  


