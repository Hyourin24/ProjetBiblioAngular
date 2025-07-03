import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  lougoutVisible: boolean = false;
  user: any = null;
  currentPage: number = 1;
  pageSize: number = 4;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: ApiService
  ) { }

  ngOnInit(): void {
    this.idClick = this.route.snapshot.paramMap.get('id');
    this.eventId = this.idClick || '';
    const userData = localStorage.getItem('user');
    if (userData) {
      this.eventService.getUserById(userData).subscribe({
        next: (res: any) => {
          // Sécurise l'accès à la donnée utilisateur
          if (res && typeof res === 'object') {
            if ('data' in res && res.data) {
              this.user = res.data;
              this.userId = res.data._id || '';
            } else {
              this.user = res;
              this.userId = res._id || '';
            }
          } else {
            this.user = null;
            this.userId = '';
          }
         
        },
        error: () => {
          this.user = null;
          this.userId = '';
        }
      });
    } else {
      this.user = null;
      this.userId = '';
      // Optionnel : gérer le cas où l'utilisateur n'est pas trouvé dans le localStorage
    }

    this.checkAuth();
    this.eventService.getEvent().subscribe((events: any) => {
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
      
    });
  }

  clickLogin(): void {
    this.router.navigate(['/login']);
  }

  clickRegister(): void {
    this.router.navigate(['/inscription']);
  }

  clickProfil(): void {
    this.router.navigate(['/profil']);
  }

  clickAccueil(): void {
    this.router.navigate(['/accueil']);
  }

  clickLougout(): void {
    const deconnexion = document.querySelector(".deconnexion") as HTMLElement;
    if (deconnexion) {
      deconnexion.style.display = "block";
    }
    this.lougoutVisible = true;
  }

  clickCrossLougout(): void {
    const deconnexion = document.querySelector(".deconnexion") as HTMLElement;
    if (deconnexion) {
      deconnexion.style.display = "none";
    }
    this.lougoutVisible = false;
  }

  logout(): void {
    this.eventService.deconnexion().subscribe({
      next: () => {
        alert("Déconnexion réussie");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.isLoggedIn = false;
        window.location.reload();
      },
      error: (error: any) => {
        console.error("Erreur lors de la déconnexion :", error);
      }
    });
  }

  clickMenu(): void {
    const hamburger = document.getElementById("hamburger") as HTMLElement;
    const aside = document.querySelector(".menuAside") as HTMLElement;
    const cross = document.getElementById("cross") as HTMLElement;
    if (aside) aside.style.display = "block";
    if (hamburger) hamburger.style.display = "none";
    if (cross) cross.style.display = "block";
  }

  crossMenu(): void {
    const cross = document.getElementById("cross") as HTMLElement;
    const aside = document.querySelector(".menuAside") as HTMLElement;
    const hamburger = document.getElementById("hamburger") as HTMLElement;
    if (hamburger) hamburger.style.display = "block";
    if (aside) aside.style.display = "none";
    if (cross) cross.style.display = "none";
  }

  reserveEvent(eventId: string): void {
    

    if (!this.userId || !eventId) {
      console.error("❌ userId ou eventId manquant");
      alert("Utilisateur non identifié ou événement invalide.");
      return;
    }

    this.eventService.postEventBook(eventId, this.userId).subscribe({
      next: (res: any) => {
        this.isReserved = true;
        this.popupVisible = true;
      },
      error: (err: any) => {
        
        alert(err.error?.message || "Erreur lors de la réservation.");
      }
    });
  }

  clickCrossDemandReserve(): void {
    const eventReserved = document.querySelector(".eventReserved") as HTMLElement;
    if (eventReserved) {
      eventReserved.style.display = "none";
    }
    this.popupVisible = false;
  }

  rechercheResult(): void {
    const term = this.recherche?.toLowerCase().trim() || '';
    this.resultatsFiltres = this.eventList.filter((event: any) =>
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

  get totalPages(): number {
    return Math.ceil(this.resultatsFiltres.length / this.pageSize);
  }

  setPage(page: number) {
    this.currentPage = page;
  }

  get eventsPage(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.resultatsFiltres.slice(start, start + this.pageSize);
  }
}
