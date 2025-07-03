import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modif-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modif-profil.component.html',
  styleUrl: './modif-profil.component.css'
})
export class ModifProfilComponent implements OnInit {
  // Propriété pour stocker les informations de l'utilisateur connecté
  user: any = null;
  // Indique si le formulaire est en cours de soumission
  isSubmitting = false;

  // Constructeur avec injection du service API et du Router
  constructor(private apiService: ApiService, private router: Router) {}

  // Initialisation du composant
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

  // Soumission du formulaire de modification du profil
  onSubmit() {
    if (!this.user) return;
    this.isSubmitting = true;
    this.apiService.updateUser(this.user._id, {
      address: this.user.address,
      city: this.user.city,
      postalCode: this.user.postalCode,
      phone: this.user.phone
    }).subscribe({
      next: (res) => {
        // Mets à jour le localStorage pour garder les infos à jour
        if (res && res.data) {
          localStorage.setItem('user', JSON.stringify(res.data));
        }
        this.isSubmitting = false;
        this.router.navigate(['/profil']);
      },
      error: () => {
        this.isSubmitting = false;
        // Gère l'erreur si besoin
      }
    });
  }

  // Annule la modification et retourne au profil
  annuler() {
    this.router.navigate(['/profil']);
  }

  // Navigation vers la page d'accueil
  clickAccueil() {
    this.router.navigate(['/accueil']);
  }
}
