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
  // ID de l'utilisateur connecté
  userId: string = "";
  // Liste complète des livres (non utilisée directement ici)
  bookList: Book[] = [];
  // Livres réservés par l'utilisateur
  bookReserved: Book[] = [];
  // Livres lus par l'utilisateur
  bookRead: Book[] = [];
  // Événements réservés par l'utilisateur
  eventReserved: EventBook[] = [];
  // Indique si l'utilisateur est connecté
  isLoggedIn: boolean = false;

  // Constructeur avec injection du Router, de la route et du service API
  constructor(private router: Router, private route: ActivatedRoute, private httpTestService: ApiService) { }

  // Initialisation du composant
  ngOnInit() {
    this.checkAuth();

    // Récupère les données utilisateur depuis le localStorage
    const userData = localStorage.getItem('user');
    let userParsed: any = null;
    if (!userData) {
      // Si aucune donnée utilisateur, redirige vers la page de login
      this.router.navigate(['/login']);
      return;
    }
    // Si userData commence par {, c'est un objet JSON, sinon c'est un id
    if (userData.trim().startsWith('{')) {
      try {
        userParsed = JSON.parse(userData);
      } catch (e) {
        // Si parsing échoue, supprime le localStorage et redirige vers login
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
        return;
      }
    } else {
      userParsed = { _id: userData };
    }
    this.userId = userParsed._id;

    // Récupère les informations utilisateur depuis l'API
    this.httpTestService.getUserById(this.userId).subscribe(res => {
      // res est un objet User
      const user = res;
      // Récupère les IDs des livres réservés, lus et des événements réservés
      const reservedBooks = user.bookReserved || [];
      const readBooks = user.booksRead || [];
      const reservedEvents = user.eventReserved || [];

      // Récupère la liste des livres actifs pour filtrer ceux du user
      this.httpTestService.getBooksActive().subscribe(bookJoin => {
        // Filtre les livres réservés par l'utilisateur
        this.bookReserved = bookJoin.filter(book => reservedBooks.includes(book._id));
        // Filtre les livres lus par l'utilisateur
        this.bookRead = bookJoin.filter(book => readBooks.includes(book._id));
      });

      // Récupère la liste des événements et filtre ceux réservés par l'utilisateur
      this.httpTestService.getEvent().subscribe(eventJoin => {
        this.eventReserved = eventJoin.filter((event: { _id: string; }) => reservedEvents.includes(event._id));
      });
    });
  }

  // Navigation vers la page d'un livre
  clickBook(bookId: string) {
    this.router.navigate(['/book', bookId]);
  }

  // Navigation vers la page d'accueil
  clickAccueil() {
    this.router.navigate(['/accueil']);
  }

  // Vérifie l'authentification utilisateur
  checkAuth(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  }
}




