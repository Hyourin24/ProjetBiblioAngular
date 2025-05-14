import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  pseudo: string = "";
  email: string = "";
  password: string = "";
      
  constructor(private router: Router, private httpTestService: ApiService) { }

  login() {
    const authBody = { pseudo: this.pseudo, password: this.password };

    this.httpTestService.connexion(authBody).subscribe({
      next: response => {
        localStorage.setItem('token', response.token); 
        this.router.navigate(['/accueil']);
      },
      error: () => {
        alert('Pseudo ou mot de passe invalide');
      }
    });
  }
}
