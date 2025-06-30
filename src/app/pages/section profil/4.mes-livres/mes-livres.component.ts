import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Book } from '../../../modules/Book';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mes-livres',
  imports: [CommonModule, FormsModule],
  templateUrl: './mes-livres.component.html',
  styleUrl: './mes-livres.component.css'
})
export class MesLivresComponent implements OnInit {
  userId: string = '';
  user: any = null;
  mesLivres: Book[] = [];
  livresLoues: any[] = []; // Livres que je loue
  demandesLocation: any[] = []; // Demandes de location reçues

  constructor(private apiService: ApiService, public router: Router) {}

  ngOnInit(): void {
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
      // userData est juste l'id
      userParsed = { _id: userData };
    }

    // Récupère l'utilisateur puis les livres et les loans
    this.apiService.getUserById(userParsed._id).subscribe({
      next: (res) => {
        if (res && typeof res === 'object') {
          if ('data' in res && res.data) {
            this.user = res.data;
          } else {
            this.user = res;
          }
        } else {
          this.user = null;
        }

        if (this.user && this.user._id) {
          this.userId = this.user._id;
          // Charge les livres dont je suis propriétaire
          this.apiService.getBooksActive().subscribe((books: Book[]) => {
            this.mesLivres = books.filter(book => book.owner === this.userId);
          });

          // Recherche dans les loans
          this.apiService.getLoans().subscribe((loans: any[]) => {
            // Livres que je loue (où l'user est le demandeur)
            this.livresLoues = loans
              .filter(loan => loan.user && (loan.user._id === this.userId || loan.user.name === this.user.name))
              .map(loan => loan.book);

            // Demandes de location reçues (où un de mes livres est demandé)
            this.demandesLocation = loans
              .filter(loan => loan.book && loan.book.owner === this.userId)
              .map(loan => ({
                book: loan.book,
                user: loan.user
              }));
          });
        }
      },
      error: () => {
        this.user = null;
      }
    });
  }

  clickAccueil() {
    this.router.navigate(['/accueil']);
  }

  clickBook(bookId: string) {
    this.router.navigate(['/book', bookId]);
  }

  retirerLivre(bookId: string) {
    this.apiService.deleteBook(bookId).subscribe({
      next: () => {
        this.mesLivres = this.mesLivres.filter(livre => livre._id !== bookId);
      },
      error: () => {
        alert("Erreur lors de la suppression du livre.");
      }
    });
  }
}
