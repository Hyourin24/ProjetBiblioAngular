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
      
  constructor(private router: Router, private httpTestService: ApiService) { }

  ngOnInit() {
    //On reprend la liste des pseudos 
    this.httpTestService.getUser().subscribe(email =>{
      this.emailList = email
      console.log(this.emailList);
    });
  }

  login() {
    const authBody = { email: this.email, password: this.password };

    this.httpTestService.connexion(authBody).subscribe({
      next: response => {
        // Stocke l'objet utilisateur complet, pas juste l'id
        localStorage.setItem('user',  JSON.stringify(response.user));
        localStorage.setItem('token', response.token); 
        this.router.navigate(['/accueil']);
      },
      error: () => {
        alert('Pseudo ou mot de passe invalide');
      }
    });
  }

  inscription() {
    this.router.navigate(['/inscription']);
  }
}
