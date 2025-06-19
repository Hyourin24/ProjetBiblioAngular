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
    if (userData) {
      const userParsed = JSON.parse(userData);
      if (userParsed && userParsed._id) {
        this.apiService.getUserById(userParsed._id).subscribe({
          next: (res) => {
            // Sécurise l'accès à la donnée utilisateur
            if (res && typeof res === 'object') {
              if ('data' in res && res.data) {
                this.user = res.data;
              } else {
                this.user = res;
              }
            } else {
              this.user = null;
            }
            console.log('User utilisé:', this.user);
          },
          error: (err) => {
            // Optionnel : log minimal côté dev, à retirer en prod
          }
        });
      }
    }
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
  clickModifier() {
    this.router.navigate(['/profil/modifier']);
  }
}
