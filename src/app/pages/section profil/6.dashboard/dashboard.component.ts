import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../modules/User';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userList: User[] = [];

  constructor(private router: Router, private httpTestService: ApiService) { }

  ngOnInit() {
    this.loadUsers();
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

  clickAccueil() {
    this.router.navigate(['/accueil']);
  }
}
