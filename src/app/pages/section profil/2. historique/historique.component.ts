import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Book } from '../../../modules/Book';
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
  bookReserved: Book[] = [];
  bookRead: Book[] = [];
  eventReserved: EventBook[] = [];
  isLoggedIn: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private httpTestService: ApiService) { }

  ngOnInit() {
    this.checkAuth();

    const userData = localStorage.getItem('user');
    let userParsed: any = null;
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }
    // Si userData commence par {, c'est un objet, sinon c'est un id
    if (userData.trim().startsWith('{')) {
      try {
        userParsed = JSON.parse(userData);
      } catch (e) {
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
        return;
      }
    } else {
      userParsed = { _id: userData };
    }
    this.userId = userParsed._id;

    this.httpTestService.getUserById(this.userId).subscribe(res => {
      // res est un objet User
      const user = res;
      const reservedBooks = user.bookReserved || [];
      const readBooks = user.booksRead || [];
      const reservedEvents = user.eventReserved || [];

      // On récupère les livres actifs pour filtrer ceux du user
      this.httpTestService.getBooksActive().subscribe(bookJoin => {
        this.bookReserved = bookJoin.filter(book => reservedBooks.includes(book._id));
        this.bookRead = bookJoin.filter(book => readBooks.includes(book._id));
      });

      // On récupère les events
      this.httpTestService.getEvent().subscribe(eventJoin => {
        this.eventReserved = eventJoin.filter((event: { _id: string; }) => reservedEvents.includes(event._id));
      });
    });
  }

  clickBook(bookId: string) {
    this.router.navigate(['/book', bookId]);
  }
  clickAccueil() {
    this.router.navigate(['/accueil']);
  }

  checkAuth(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  }
}




