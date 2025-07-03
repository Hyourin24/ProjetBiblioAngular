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

  name: string = "";
  email: string = "";
  password: string = "";
  phone: string = "";
  address: string = "";
  city: string = "";
  postalCode: string = "";
  emailList: User[] = [];
  showPassword: boolean = false;
  
 
  constructor(private router: Router, private httpTestService: ApiService) { }

  ngOnInit() {
    this.httpTestService.getUser().subscribe(email => {
      this.emailList = email;
      console.log(this.emailList);
    });
  }

  inscription() {
     const inscriptionBody = { name: this.name, email: this.email, password: this.password, phone: this.phone, address: this.address, city: this.city, postalCode: this.postalCode };
     console.log("Body envoyé :", inscriptionBody);

    this.httpTestService.inscription(inscriptionBody).subscribe({
      next: response => {
        localStorage.setItem('token', response.token); 
        alert('Inscription réussie');
        this.router.navigate(['/login']);
      },
      error: () => {
        if (!this.name || !this.email || !this.password || !this.address || !this.city || !this.postalCode ) {
          alert("Veuillez remplir tous les champs avec un asterisk (*)");
        return;
        }
      }
    
    })
  }

  login() {
    this.router.navigate(['/login']);
  }
}
