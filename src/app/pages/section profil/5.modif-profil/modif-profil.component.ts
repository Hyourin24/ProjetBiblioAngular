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
    if (userData) {
      this.user = JSON.parse(userData);
    }
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
        localStorage.setItem('user', JSON.stringify({ ...this.user, ...res.data }));
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
}
