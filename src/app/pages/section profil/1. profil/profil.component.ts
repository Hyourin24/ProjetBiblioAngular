import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-profil',
  imports: [FormsModule, CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  constructor(private router: Router,  private httpTestService: ApiService) { }
  
  ngOnInit() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.router.navigate(['/login']);
      console.log ('pas accès')
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
}
