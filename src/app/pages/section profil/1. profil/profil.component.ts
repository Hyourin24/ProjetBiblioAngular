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
  user: any = null;

  constructor(private router: Router, private apiService: ApiService) {}

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
}
