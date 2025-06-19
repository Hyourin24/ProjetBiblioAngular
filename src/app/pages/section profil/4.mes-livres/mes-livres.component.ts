import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mes-livres',
  imports: [],
  templateUrl: './mes-livres.component.html',
  styleUrl: './mes-livres.component.css'
})

export class MesLivresComponent {

  constructor(public router: Router) {}

  clickAccueil() {
    this.router.navigate(['/accueil']);
  }
}
