import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { User } from '../../modules/User';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  name: string = "";
  email: string = "";
  password: string = "";
  emailList: User[] = [];
  showPassword: boolean = false;
      
  // Constructeur du composant, injection du Router et du service ApiService
  constructor(private router: Router, private httpTestService: ApiService) { }

  // Méthode appelée à l'initialisation du composant
  ngOnInit() {
    // Récupère la liste des utilisateurs via le service et l'assigne à emailList
    // Utile pour l'autocomplétion ou la vérification des emails existants
    this.httpTestService.getUser().subscribe(email =>{
      this.emailList = email;
    });
  }

  // Méthode appelée lors de la soumission du formulaire de connexion
  login() {
    // Création de l'objet d'authentification avec l'email et le mot de passe saisis
    const authBody = { email: this.email, password: this.password };

    // Appel du service de connexion
    this.httpTestService.connexion(authBody).subscribe({
      next: response => {
        // En cas de succès, stocke l'utilisateur complet et le token dans le localStorage
        localStorage.setItem('user',  JSON.stringify(response.user));
        localStorage.setItem('token', response.token); 
        this.router.navigate(['/accueil']); // Redirige vers la page d'accueil
      },
      error: () => {
        // En cas d'erreur, affiche une alerte à l'utilisateur
        alert('Pseudo ou mot de passe invalide');
      }
    });
  }

  // Méthode pour rediriger vers la page d'inscription
  inscription() {
    this.router.navigate(['/inscription']);
  }
}
