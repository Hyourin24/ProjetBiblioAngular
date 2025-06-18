import { Component } from '@angular/core';
import { EventBook } from '../../modules/Event';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  
  userId: string = "";
  eventId: string = "";
  eventList: any[] = [];
  resultatsFiltres: any[] = [];

  popupVisible: boolean = false;
  isReserved: boolean = false;
  idClick: string | null = null;
  recherche: string = '';
  isLoggedIn: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private eventService: ApiService) { }

  ngOnInit() {
    this.idClick = this.route.snapshot.paramMap.get('id');
    this.eventId = this.idClick || '';
    const userData = localStorage.getItem('user');
    if (userData) {
      const userParsed = JSON.parse(userData);
      this.userId = userParsed._id;
      console.log("👤 ID utilisateur connecté :", this.userId);
    }
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

  reserveEvent(eventId: string) {
    console.log("🆔 Event ID cliqué :", eventId);
    console.log("👤 User ID :", this.userId);
  
    if (!this.userId || !eventId) {
      console.error("❌ userId ou eventId manquant");
      alert("Utilisateur non identifié ou événement invalide.");
      return;
    }
  
    this.eventService.postEventBook(eventId, this.userId).subscribe({
      next: res => {
        console.log("✅ Réservation réussie :", res);
        this.isReserved = true;
        this.popupVisible = true;
      },
      error: err => {
        console.error("❌ Erreur réservation :", err);
        alert(err.error?.message || "Erreur lors de la réservation.");
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

  clickAccueil() {
    this.router.navigate(['/accueil']);
  }

  clickCrossDemandReserve() {
    const eventReserved = document.querySelector(".eventReserved") as HTMLElement;
    eventReserved.style.display = "none";
    this.popupVisible = false;
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
