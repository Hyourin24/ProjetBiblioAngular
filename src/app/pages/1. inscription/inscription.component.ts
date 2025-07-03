import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../modules/User';
import { NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-inscription',
  imports: [CommonModule, FormsModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {

  // Déclaration des propriétés du composant pour stocker les informations du formulaire d'inscription
  name: string = ""; // Nom de l'utilisateur
  email: string = ""; // Email de l'utilisateur
  password: string = ""; // Mot de passe de l'utilisateur
  phone: string = ""; // Numéro de téléphone de l'utilisateur
  address: string = ""; // Adresse de l'utilisateur
  city: string = ""; // Ville de l'utilisateur
  postalCode: string = ""; // Code postal de l'utilisateur
  emailList: User[] = []; // Liste des utilisateurs récupérés depuis l'API
  showPassword: boolean = false; // Affiche ou masque le mot de passe
  
 
  // Constructeur du composant, injection du Router et du service ApiService
  constructor(private router: Router, private httpTestService: ApiService) { }

  // Méthode appelée à l'initialisation du composant
  ngOnInit() {
    // Récupère la liste des utilisateurs via le service et l'assigne à emailList
    this.httpTestService.getUser().subscribe(email => {
      this.emailList = email;
    });
  }

  // Méthode appelée lors de la soumission du formulaire d'inscription
  inscription() {
     // Création de l'objet à envoyer à l'API avec les valeurs du formulaire
     const inscriptionBody = { 
       name: this.name, 
       email: this.email, 
       password: this.password, 
       phone: this.phone, 
       address: this.address, 
       city: this.city, 
       postalCode: this.postalCode 
     };

    // Appel du service d'inscription
    this.httpTestService.inscription(inscriptionBody).subscribe({
      next: response => {
        // En cas de succès, stocke le token et redirige vers la page de login
        localStorage.setItem('token', response.token); 
        alert('Inscription réussie');
        this.router.navigate(['/login']);
      },
      error: () => {
        // En cas d'erreur, vérifie si tous les champs obligatoires sont remplis
        if (!this.name || !this.email || !this.password || !this.address || !this.city || !this.postalCode ) {
          alert("Veuillez remplir tous les champs avec un asterisk (*)");
        return;
        }
      }
    
    })
  }

  // Méthode pour rediriger vers la page de login
  login() {
    this.router.navigate(['/login']);
  }
}
