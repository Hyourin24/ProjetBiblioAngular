import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../modules/User';
import { Book } from '../../../modules/Book';
import { EventBook } from '../../../modules/Event';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Propriétés principales pour stocker les données
  user: any = null;
  bookList: Book[] = [];
  userList: User[] = [];
  eventList: EventBook [] = [];
  isActive: boolean = true;

  // Résultats filtrés pour les recherches
  resultatsFiltres: User[] = [];
  resultatBook: Book[] = [];
  resultatEvent: EventBook[] = [];

  // Champs de recherche
  recherche: string = '';
  rechercheBook: string = '';
  rechercheEvent: string = '';

  // Constructeur avec injection du Router et du service API
  constructor(private router: Router, private httpTestService: ApiService) { }

  // Initialisation du composant
  ngOnInit() {
    this.loadUsers();
    this.loadBooks();
    this.loadEvent();
  
    // Vérifie l'utilisateur connecté et ses droits admin
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }

    let userParsed = JSON.parse(userData);
    this.user = userParsed;
    if (!this.user.admin) {
      this.router.navigate(['/**']); 
      return;
    }
  }

  // Charge la liste des utilisateurs
  loadUsers() {
    this.httpTestService.getUser().subscribe({
      next: (users) => {
        this.userList = users;
      },
      error: (err) => {
        
        alert("Impossible de charger les utilisateurs.");
      }
    });
  }

  // Charge la liste des livres
  loadBooks() {
    this.httpTestService.getBooks().subscribe({
      next: (books) => {
        this.bookList = books;
      },
      error: (err) => {
        
        alert("Impossible de charger les livres.");
      }
    });
  }

  // Charge la liste des événements
  loadEvent() {
    this.httpTestService.getEvent().subscribe({
      next: (events) => {
        this.eventList = events;
      },
      error: (err) => {
        
        alert("Impossible de charger les livres.");
      }
    });
  }
  
  // Recherche utilisateur par nom
  rechercheResult(): void {
    const term = this.recherche?.toLowerCase().trim() || '';
    this.resultatsFiltres = this.userList.filter(user =>
      user.name && user.name.toLowerCase().startsWith(term)
    );
  }

  // Recherche livre par titre
  rechercheResultBook(): void {
    const termBook = this.rechercheBook?.toLowerCase().trim() || '';
    this.resultatBook = this.bookList.filter(book =>
      book.title && book.title.toLowerCase().startsWith(termBook)
    );
  }

  // Recherche événement par titre
  rechercheResultEvent(): void {
    const termEvent = this.rechercheEvent?.toLowerCase().trim() || '';
    this.resultatEvent = this.eventList.filter(event =>
      event.title && event.title.toLowerCase().startsWith(termEvent)
    );
  }
  
  // Suppression d'un utilisateur
  deleteUser(userId: string) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (!confirmation) return;

    this.httpTestService.deleteUser(userId).subscribe({
      next: () => {
        this.userList = this.userList.filter(user => user._id !== userId);
        alert("Utilisateur supprimé avec succès.");
      },
      error: (err) => {
       
        alert("Impossible de supprimer cet utilisateur.");
      }
    });
  }

  // Suppression d'un livre
  deleteBook(bookId: string) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer / rendre inactif ce livre ?");
    if (!confirmation) return;

    this.httpTestService.deleteBook(bookId).subscribe({
      next: () => {
        this.bookList = this.bookList.filter(book => book._id !== bookId);
        alert("Livre supprimé avec succès.");
      },
      error: (err) => {
      
        alert("Impossible de supprimer ce livre.");
      }
    });
  }

  // Suppression d'un événement
  deleteEvent(eventId: string) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer / rendre inactif ce livre ?");
    if (!confirmation) return;

    this.httpTestService.deleteEvent(eventId).subscribe({
      next: () => {
        this.eventList = this.eventList.filter(event => event._id !== eventId);
        alert("Livre supprimé avec succès.");
      },
      error: (err) => {
        
        alert("Impossible de supprimer ce livre.");
      }
    });
  }

  // Mise à jour du statut actif d'un utilisateur
  updateActiveStatus(userId: string) {
    const confirmation = confirm('Êtes-vous sûr de vouloir changer le statut de cet utilisateur ?');
    if (!confirmation) return;

    this.httpTestService.updateIsActive(userId).subscribe({
      next: (res) => {
        const user = this.userList.find(user => user._id === userId);
        if (user) {
          user.isActive = !user.isActive;
        }
        alert('Statut mis à jour avec succès.');
      },
      error: (err) => {
        
        alert("Impossible de mettre à jour le statut de l'utilisateur.");
      }
    });
   }

   // Réactivation d'un livre
   updateActiveStatusBook(bookId: string) {
    const confirmation = confirm('Êtes-vous sûr de vouloir réactiver ce livre ?');
    if (!confirmation) return;
  
    this.httpTestService.updateIsActiveBook(bookId).subscribe({
      next: (res) => {
        const book = this.bookList.find(book => book._id === bookId);
        if (book) {
          book.isActive = true; // ou: !book.isActive si tu veux toggle
        }
        alert('Livre réactivé avec succès.');
      },
      error: (err) => {
        
        alert("Impossible de mettre à jour le statut du livre.");
      }
    });
  }
  
  // Navigation vers la page d'accueil
  clickAccueil() {
    this.router.navigate(['/accueil']);
  }
}