import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Book, BookWithUser } from '../../../modules/Book';

@Component({
  selector: 'app-poster',
  imports: [FormsModule, CommonModule],
  templateUrl: './poster.component.html',
  styleUrls: ['./poster.component.css']
})
export class PosterComponent implements OnInit {
  // Liste complète des livres (non utilisée directement ici)
  bookList: Book[] = [];
  // ID du livre cliqué (non utilisé ici)
  bookClick = "";
  // Livre sélectionné avec infos utilisateur (non utilisé ici)
  book: BookWithUser | null = null;

  // Propriétés du formulaire de création de livre
  userId: string = "";
  bookId: string = "";
  title: string = "";
  description: string = "";
  genre: "fantasy" | "science-fiction" | "romance" | "mystery" | "non-fiction" | "historical" | "thriller" | "horror" | "biography" | "self-help" | "children's" | "young adult" | "poetry" | "classics" | "manga" | "comics" | "adventure" | "educative" | "cookbook" | "travel" | "humor" = "fantasy";
  genres: ("fantasy" | "science-fiction" | "romance" | "mystery" | "non-fiction" | "historical" | "thriller" | "horror" | "biography" | "self-help" | "children's" | "young adult" | "poetry" | "classics" | "manga" | "comics" | "adventure" | "educative" | "cookbook" | "travel" | "humor")[] = [
    "fantasy", "science-fiction", "romance", "mystery", "non-fiction", "historical", "thriller", "horror", "biography",
    "self-help", "children's", "young adult", "poetry", "classics", "manga", "comics", "adventure", "educative", "cookbook", "travel", "humor"
  ];
  author: string = "";
  publishedYear: number = 0;
  language: "french" | "ukrainian" | "english" = "french";
  languages: ('french' | 'ukrainian' | 'english')[] = ["french", "ukrainian", "english"];
  state: "new" | "good" | "used" = "new";
  states: ("new" | "good" | "used")[] = ["new", "good", "used"];
  addedAt: Date = new Date();
  imageCouverture: string = "";
  imageBack: string = "";
  imageInBook: string = "";

  // Indique si l'utilisateur est connecté
  isLoggedIn: boolean = false;
  // Stocke les fichiers images sélectionnés par type
  selectedImages: { [key: string]: File } = {};

  // Constructeur avec injection du Router, de la route et du service API
  constructor(private router: Router, private route: ActivatedRoute, private httpTestService: ApiService) { }

  // Initialisation du composant
  ngOnInit() {
    this.checkAuth();

    // Récupère les données utilisateur depuis le localStorage
    const userData = localStorage.getItem('user');
    let userParsed: any = null;
    if (!userData) {
      // Si aucune donnée utilisateur, redirige vers la page de login
      this.router.navigate(['/login']);
      return;
    }
    // Si userData commence par {, c'est un objet JSON, sinon c'est un id
    if (userData.trim().startsWith('{')) {
      try {
        userParsed = JSON.parse(userData);
      } catch (e) {
        // Si parsing échoue, supprime le localStorage et redirige vers login
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
        return;
      }
    } else {
      userParsed = { _id: userData };
    }
    this.userId = userParsed._id;

    // Récupère les informations utilisateur depuis l'API (optionnel ici)
    this.httpTestService.getUserById(this.userId).subscribe(user => {
      // Optionnel : tu peux utiliser les infos utilisateur ici si besoin
    });
  }

  // Gestion de la sélection d'une image pour un type donné
  onImageSelected(event: Event, type: 'imageCouverture' | 'imageBack' | 'imageInBook') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImages[type] = input.files[0];
    }
  }

  // Convertit un fichier en base64 (pour l'envoi à l'API)
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Soumission du formulaire pour poster un nouveau livre
  async postBook() {
    let CouvertureBase64 = null;
    let InbookBase64 = null;
    let BackBase64 = null;

    // Conversion des images sélectionnées en base64
    if (this.selectedImages['imageCouverture']) {
      CouvertureBase64 = await this.convertFileToBase64(this.selectedImages['imageCouverture']);
    }
    if (this.selectedImages['imageInBook']) {
      InbookBase64 = await this.convertFileToBase64(this.selectedImages['imageInBook']);
    }
    if (this.selectedImages['imageBack']) {
      BackBase64 = await this.convertFileToBase64(this.selectedImages['imageBack']);
    }

    // Création de l'objet à envoyer à l'API
    const postBody = {
      title: this.title,
      description: this.description,
      genre: this.genre,
      author: this.author,
      publishedYear: this.publishedYear,
      language: this.language,
      state: this.state,
      imageCouverture: CouvertureBase64,
      imageBack: BackBase64,
      imageInBook: InbookBase64,
      owner: this.userId // Ajoute bien l'owner ici !
    };

    // Appel du service pour poster le livre
    this.httpTestService.postBook(postBody).subscribe({
      next: (response) => {
        // Réinitialise le formulaire après succès
        this.title = '';
        this.description = '';
        this.genre = 'fantasy';
        this.author = '';
        this.publishedYear = 0;
        this.language = 'french';
        this.state = 'new';
        window.location.reload();
      },
      error: (error) => {
        alert("Tous les champs sont requis, ou l'une des images est trop volumineuse. Veuillez réessayer.");
      }
    });
  }

  // Vérifie l'authentification utilisateur
  checkAuth(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  }

  // Navigation vers la page d'accueil
  clickAccueil() {
    this.router.navigate(['/accueil']);
  }

  // Traduction des langues pour l'affichage
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
  // Traduction de l'état du livre pour l'affichage
  translateState(et: string): string {
    switch (et?.toLowerCase()) {
      case 'new':
        return 'Neuf';
      case 'good':
        return 'Bon état';
      case 'used':
        return 'Usé';
      default:
        return et;
    }
  }
  // Traduction du genre pour l'affichage
  translateGenre(genre: string): string {
    switch (genre?.toLowerCase()) {
      case 'fantasy':
        return 'Fantastique';
      case 'science-fiction':
        return 'Science-fiction';
      case 'romance':
        return 'Romance';
      case 'mystery':
        return 'Mystère';
      case 'non-fiction':
        return 'Non-fiction';
      case 'historical':
        return 'Historique';
      case 'thriller':
        return 'Thriller';
      case 'horror':
        return 'Horreur';
      case 'biography':
        return 'Biographie';
      case 'self-help':
        return 'Développement personnel';
      case "children's":
        return 'Jeunesse';
      case 'young adult':
        return 'Jeunes adultes';
      case 'poetry':
        return 'Poésie';
      case 'classics':
        return 'Classiques';
      case 'manga':
        return 'Manga';
      case 'comics':
        return 'Bandes dessinées';
      case 'adventure':
        return 'Aventure';
      case 'educative':
        return 'Éducatif';
      case 'cookbook':
        return 'Livre de cuisine';
      case 'travel':
        return 'Voyage';
      case 'humor':
        return 'Humour';
      default:
        return genre;
    }
  }
}
