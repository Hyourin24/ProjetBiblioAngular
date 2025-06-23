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
  user: any = null;
  isSubmitting = false;

  constructor(private apiService: ApiService, private router: Router) {}

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
      userParsed = { _id: userData };
    }

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
      },
      error: () => {
        this.user = null;
      }
    });
  }

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

  annuler() {
    this.router.navigate(['/profil']);
  }

  clickAccueil() {
    this.router.navigate(['/accueil']);
  }
}
