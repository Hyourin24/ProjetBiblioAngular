import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  pageInscription() {
    this.router.navigate(['/inscription']);
  }

  pageConnexion() {
    this.router.navigate(['/login']);
  }
}
