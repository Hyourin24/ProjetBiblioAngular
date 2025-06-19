import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Book } from '../../modules/Book';
import { BookServiceService } from '../../services/book-service.service';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, FormsModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  usersById: { [id: string]: any } = {};

  bookId: string = "";
  title: string = "";
  description: string = "";
  genre: "fantasy" | "science-fiction" | "romance" | "mystery" | "non-fiction" | "historical" | "thriller" | "horror" | "biography" | "self-help" | "children's" | "young adult" | "poetry" | "classics" | "manga" | "comics" | "adventure" | "educative" | "cookbook" | "travel" | "humor" | "Genre" = "Genre";
  genres: ("fantasy" | "science-fiction" | "romance" | "mystery" | "non-fiction" | "historical" | "thriller" | "horror" | "biography" | "self-help" | "children's" | "young adult" | "poetry" | "classics" | "manga" | "comics" | "adventure" | "educative" | "cookbook" | "travel" | "humor")[] = [
    "fantasy", "science-fiction", "romance", "mystery", "non-fiction", "historical", "thriller", "horror", "biography",
    "self-help", "children's", "young adult", "poetry", "classics", "manga", "comics", "adventure", "educative", "cookbook", "travel", "humor"
  ];
  author: string = "";
  publishedYear: number = 0;
  date: "recent" | "ancien" | "Date" = "Date";
  language: "french" | "ukrainian" | "english" | "Language" = "Language";
  languages: ('french' | 'ukrainian' | 'english')[] = ["french", "ukrainian", "english"];
  state: "new" | "good" | "used" | "Etat" = "Etat";
  states: ("new" | "good" | "used")[] = ["new", "good", "used"];
  imageCouverture: string = ""
  isActive: boolean = true;
  ownerActive: boolean = true;
  addedAt: Date = new Date();
  

departementList: string[] = Array.from({ length: 95 }, (_, i) =>
  (i + 1).toString().padStart(2, '0')
);

selectedDepartement: string = '';



  bookList: Book[] = [];
  bookClick = ""
  book = new Array<Book>();

  resultatsFiltres: Book[] = [];
  
  recherche: string = '';
  isLoggedIn: boolean = false;
  lougoutVisible: boolean = false;
   constructor(private router: Router, private bookService: BookServiceService, private httpTestService: ApiService) { }

resultatsFiltresVille: any[] = [];
cityList: any[] = [];

ngOnInit() {
  this.checkAuth();
  this.httpTestService.getBooksActive().subscribe(books => {
    this.bookList = books;
    this.resultatsFiltres = books;
    console.log(this.bookList);
  });

  // Charger les utilisateurs une seule fois
  this.httpTestService.getUser().subscribe(users => {
    for (let user of users) {
      this.usersById[user._id] = user;
    }
  });
}


clickLogin() {
  this.router.navigate(['/login']);
}

clickRegister(){
  this.router.navigate(['/inscription']);
}

clickProfil() {
  this.router.navigate(["/profil"])
}

clickAccueil() {
  this.router.navigate(['/accueil']);
}

clickEvent() {
  this.router.navigate(['/event']);
}

clickLougout() {
  const deconnexion = document.querySelector(".deconnexion") as HTMLElement;
  deconnexion.style.display = "block";
  this.lougoutVisible = true;
}

clickCrossLougout() {
  const deconnexion = document.querySelector(".deconnexion") as HTMLElement;
  deconnexion.style.display = "none";
  this.lougoutVisible = false;
}

logout() {
  this.httpTestService.deconnexion().subscribe({
    next: () => {
      alert("Déconnexion réussie");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      window.location.reload();
    },
    error: (error) => {
      console.error("Erreur lors de la déconnexion :", error);
    }
  });
}

  clickBook(bookId: string) {
    console.log("Book cliqué :", bookId);
    // this.bookService.setSelectedBook(book);
    this.router.navigate(['/book', bookId]);
  }
  
  
  rechercheResult(): void {
    const term = this.recherche?.toLowerCase().trim() || '';
    this.resultatsFiltres = this.bookList.filter(book =>
      book.title.toLowerCase().startsWith(term)
    );
  }
  filtrerParDepartement(): void {
  if (!this.selectedDepartement) {
    this.resultatsFiltres = this.bookList;
    return;
  }

  this.resultatsFiltres = this.bookList.filter(book => {
    const user = this.usersById[book.owner];
    if (!user || !user.postalCode) return false;

    const code = user.postalCode.toString().substring(0, 2);
    return code === this.selectedDepartement;
  });
}


  filtrerParDate(): void {
    const date = this.date;
    if (!date || date === 'Date') {
      this.resultatsFiltres = this.bookList; // toutes les dates
      return;
    }
    if (date === 'recent') {
      this.resultatsFiltres = this.bookList.sort((a, b) => b.publishedYear - a.publishedYear);
    } else if (date === 'ancien') {
      this.resultatsFiltres = this.bookList.sort((a, b) => a.publishedYear - b.publishedYear);
    }
  }
  filtrerParLangue(): void {
    const langue = this.language;
    if (!langue || langue === 'Language') {
      this.resultatsFiltres = this.bookList; // toutes les langues
      return;
    }
    this.resultatsFiltres = this.bookList.filter(book =>
      book.language === langue
    );
  }
  
  filtrerParEtat(): void {
    const etat = this.state;
    if (!etat || etat === 'Etat') {
      this.resultatsFiltres = this.bookList; // tous les états
      return;
    }
    this.resultatsFiltres = this.bookList.filter(book =>
      book.state === etat
    );
  }

  filtrerParGenre(): void {
    const genre = this.genre;
    if (!genre || genre === 'Genre') {
      this.resultatsFiltres = this.bookList; // tous les genres
      return;
    }
    this.resultatsFiltres = this.bookList.filter(book =>
      book.genre === genre
    );
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

  checkAuth(): void {
  const token = localStorage.getItem('token'); // ou autre nom utilisé
  this.isLoggedIn = !!token;
}
}
