import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {

  eventList: any[] = [];
  resultatsFiltres: any[] = [];
  
  recherche: string = '';
  isLoggedIn: boolean = false;

  constructor(private router: Router, private eventService: ApiService) { }

  ngOnInit() {
    this.checkAuth();
    this.eventService.getEvent().subscribe(events => {
      // Si la réponse est un objet avec une propriété contenant le tableau :
      if (Array.isArray(events)) {
        this.eventList = events;
        this.resultatsFiltres = events;
      } else if (Array.isArray(events?.data)) {
        this.eventList = events.data;
        this.resultatsFiltres = events.data;
      } else {
        this.eventList = [];
        this.resultatsFiltres = [];
        console.error('La réponse de getEvent() n\'est pas un tableau', events);
      }
      console.log(this.eventList);
    });
  }

  clickMenu() {
    const hamburger = document.getElementById("hamburger") as HTMLElement;
    const aside = document.querySelector(".menuAside") as HTMLElement;
    const cross = document.getElementById("cross") as HTMLElement;
    aside.style.display = "block";
    hamburger.style.display = "none";
    cross.style.display = "block";
  }

  crossMenu() {
    const cross = document.getElementById("cross") as HTMLElement;
    const aside = document.querySelector(".menuAside") as HTMLElement;
    const hamburger = document.getElementById("hamburger") as HTMLElement;
    hamburger.style.display = "block";
    aside.style.display = "none";
    cross.style.display = "none";
  }

  clickLogout() {
    this.eventService.deconnexion().subscribe({
      next: () => {
        console.log("Déconnexion réussie");
        localStorage.removeItem('token');
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error("Erreur lors de la déconnexion :", error);
      }
    });
  }

  goToAccueil() {
    this.router.navigate(['/accueil']);
  }

  goToMesLivres() {
    this.router.navigate(['/mes-livres']);
  }

  goToEvenements() {
    this.router.navigate(['/event']);
  }
  rechercheResult(): void {
    const term = this.recherche?.toLowerCase().trim() || '';
    this.resultatsFiltres = this.eventList.filter(event =>
      event.title.toLowerCase().startsWith(term)
    );
  }
  translateLanguage(lang: string): string {
  switch (lang?.toLowerCase()) {
    case 'french':
      return 'Français';
    case 'english':
      return 'Anglais';
    case 'ukrainian':
      return 'Ukrainien';
    default:
      return lang;
  }
}
  checkAuth(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }
}
