import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Book } from '../../../modules/Book';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LoanDisplay {
  _id: string;
  book: Book | null;
  user: any;
  startDate: string;
  endDate: string;
  status: string;
}

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
  livresLoues: LoanDisplay[] = []; // Livres que je possède et que j'ai acceptés en location
  demandesLocation: LoanDisplay[] = []; // Demandes de location reçues (en attente)

  constructor(private apiService: ApiService, public router: Router) {}

  ngOnInit(): void {
    // Récupère l'utilisateur connecté depuis le localStorage
    const userData = localStorage.getItem('user');
    let userParsed: any = null;
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }
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

    // Récupère tous les utilisateurs pour lier avec les loans
    this.apiService.getUser().subscribe((users: any[]) => {
      // Récupère l'utilisateur connecté
      this.apiService.getUserById(userParsed._id).subscribe({
        next: (res) => {
          // Gestion du format de retour de l'API
          this.user = (res && typeof res === 'object' && 'data' in res && res.data) ? res.data : res;
          if (!this.user || !this.user._id) {
            this.user = null;
            return;
          }
          this.userId = this.user._id;

          // Charge tous les livres pour faire les correspondances
          this.apiService.getBooksActive().subscribe((booksRes: Book[]) => {
            const books = booksRes;
            this.mesLivres = books.filter(book => book.owner === this.userId);

            // Recherche dans les loans
            this.apiService.getLoans().subscribe((loansRes: any) => {
              const loans = Array.isArray(loansRes) ? loansRes : loansRes.data;

              // Demandes de location reçues (en attente)
              this.demandesLocation = loans
                .filter((loan: any) => {
                  const bookObj = books.find(b => String(b._id) === String(loan.bookId));
                  // Je suis propriétaire ET le prêt est en attente
                  return bookObj && String(bookObj.owner) === String(this.userId) && loan.status === 'pending';
                })
                .map((loan: any) => {
                  const bookObj = books.find(b => String(b._id) === String(loan.bookId)) || null;
                  const userObj = users.find(u => String(u._id) === String(loan.userId)) || null;
                  return {
                    _id: loan._id,
                    book: bookObj,
                    user: userObj,
                    startDate: loan.startDate,
                    endDate: loan.endDate,
                    status: loan.status
                  };
                });

              // Livres que je possède et que j'ai acceptés en location (confirmés)
              this.livresLoues = loans
                .filter((loan: any) => {
                  const bookObj = books.find(b => String(b._id) === String(loan.bookId));
                  // Je suis propriétaire ET le prêt est confirmé
                  return bookObj && String(bookObj.owner) === String(this.userId) && loan.status === 'confirmed';
                })
                .map((loan: any) => {
                  const bookObj = books.find(b => String(b._id) === String(loan.bookId)) || null;
                  const userObj = users.find(u => String(u._id) === String(loan.userId)) || null;
                  return {
                    _id: loan._id,
                    book: bookObj,
                    user: userObj,
                    startDate: loan.startDate,
                    endDate: loan.endDate,
                    status: loan.status
                  };
                });
            });
          });
        },
        error: () => {
          this.user = null;
        }
      });
    });
  }

  // Navigation
  clickAccueil() {
    this.router.navigate(['/accueil']);
  }

  clickBook(bookId: string) {
    this.router.navigate(['/book', bookId]);
  }

  // Suppression d'un livre
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

  // Calcul du nombre de jours entre deux dates
  getNbJours(start: string | Date, end: string | Date): number {
    const d1 = new Date(start);
    const d2 = new Date(end);
    return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Accepter une demande de location
  accepterDemande(demande: LoanDisplay) {
    this.apiService.confirmLoan(demande._id).subscribe(() => {
      demande.status = 'confirmed';
      // Optionnel : rafraîchir la liste ou déplacer la demande dans livresLoues
    });
  }

  // Refuser une demande de location
  refuserDemande(demande: LoanDisplay) {
    this.apiService.cancelLoan(demande._id).subscribe(() => {
      demande.status = 'refused';
      // Optionnel : retirer la demande de la liste
    });
  }
}
