import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-profil',
  imports: [FormsModule, CommonModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  // Propriété pour stocker les informations de l'utilisateur connecté
  user: any = null;

  // Constructeur avec injection du Router et du service ApiService
  constructor(private router: Router, private apiService: ApiService) {}

  // Méthode appelée à l'initialisation du composant
  ngOnInit(): void {
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

    // Récupère les informations utilisateur depuis l'API
    this.apiService.getUserById(userParsed._id).subscribe({
      next: (res) => {
        // Si la réponse contient un objet data, on l'utilise, sinon on prend la réponse brute
        if (res && typeof res === 'object') {
          if ('data' in res && res.data) {
            this.user = res.data;
          } else {
            this.user = res;
          }
        } else {
          this.user = null;
        }
      },
      error: () => {
        this.user = null;
      }
    });
  }

  // Méthodes de navigation vers les différentes pages du profil
  clickAccueil() {
    this.router.navigate(['/accueil']);
  }
  clickHistorique() {
    this.router.navigate(['/profil/historique']);
  }
  clickPoster() {
    this.router.navigate(['/profil/poster']);
  }
  clickMesLivres() {
    this.router.navigate(['/profil/mes-livres']);
  }
  clickModifier() {
    this.router.navigate(['/profil/modifier']);
  }
  clickDashboard() {
    this.router.navigate(['/profil/dashboard']);
  }
  clickPostEvent() {
    this.router.navigate(['/profil/post-event']);
  }
}
