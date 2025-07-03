import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../modules/User';
import { Book } from '../../../modules/Book';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user: any = null;
  bookList: Book[] = [];
  userList: User[] = [];
  isActive: boolean = true;
  resultatsFiltres: User[] = [];
  recherche: string = '';

  constructor(private router: Router, private httpTestService: ApiService) { }

  ngOnInit() {
    this.loadUsers();
    this.loadBooks();
  
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

  loadUsers() {
    this.httpTestService.getUser().subscribe({
      next: (users) => {
        this.userList = users;
       
      },
      error: (err) => {
        console.error("❌ Erreur lors du chargement des utilisateurs :", err);
        alert("Impossible de charger les utilisateurs.");
      }
    });
  }

  loadBooks() {
    this.httpTestService.getBooks().subscribe({
      next: (books) => {
        this.bookList = books;
        console.log("📚Livres", this.bookList)
      },
      error: (err) => {
        console.error("❌ Erreur lors du chargement des livres :", err);
        alert("Impossible de charger les livres.");
      }
    });
  }

  rechercheResult(): void {
    const term = this.recherche?.toLowerCase().trim() || '';
    this.resultatsFiltres = this.userList.filter(user =>
      user.name && user.name.toLowerCase().startsWith(term)
    );
    
  }

  deleteUser(userId: string) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (!confirmation) return;

    this.httpTestService.deleteUser(userId).subscribe({
      next: () => {
        this.userList = this.userList.filter(user => user._id !== userId);
        alert("Utilisateur supprimé avec succès.");
      },
      error: (err) => {
        console.error("❌ Erreur lors de la suppression :", err);
        alert("Impossible de supprimer cet utilisateur.");
      }
    });
  }

  deleteBook(bookId: string) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer / rendre inactif ce livre ?");
    if (!confirmation) return;

    this.httpTestService.deleteBook(bookId).subscribe({
      next: () => {
        this.bookList = this.bookList.filter(book => book._id !== bookId);
        alert("Livre supprimé avec succès.");
      },
      error: (err) => {
        console.error("❌ Erreur lors de la suppression :", err);
        alert("Impossible de supprimer ce livre.");
      }
    });
  }

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
        console.error("❌ Erreur lors de la mise à jour du statut :", err);
        alert("Impossible de mettre à jour le statut de l'utilisateur.");
      }
    });
}

  clickAccueil() {
    this.router.navigate(['/accueil']);
  }
}
