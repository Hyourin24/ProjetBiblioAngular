import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class PosterComponent {
  constructor(private router: Router, private route: ActivatedRoute,  private httpTestService: ApiService) { }

   bookList: Book[] = [];
    bookClick = ""
    book: BookWithUser | null = null;
    
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
    imageCouverture: string = ""
    imageBack: string = ""
    imageInBook: string = ""

    isLoggedIn: boolean = false;


    ngOnInit() {
    
    this.checkAuth();
  
    const userId = localStorage.getItem('user');
    if (!userId) {
      console.error('❌ Pas dID utilisateur trouvé dans le localStorage.');
      return;
    }
  
    this.userId = userId;
  
    this.httpTestService.getUserById(this.userId).subscribe(user => {
      console.log(user)
      const reservedBooks = user.bookReserved || [];
      console.log('livres réservés: ', reservedBooks)
      console.log('livres lu', user.booksRead)
    })
    }

    selectedImages: { [key: string]: File } = {};

    onImageSelected(event: Event, type: 'imageCouverture' | 'imageBack' | 'imageInBook') {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        this.selectedImages[type] = input.files[0];
        console.log(`${type} sélectionnée :`, this.selectedImages[type]);
      }
    }
    convertFileToBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    }

    async postBook() {


      let CouvertureBase64 = null;
      let InbookBase64 = null;
      let BackBase64 = null;

    if (this.selectedImages) {
      CouvertureBase64 = await this.convertFileToBase64(this.selectedImages['imageCouverture']);
      InbookBase64 = await this.convertFileToBase64(this.selectedImages['imageInBook']);
      BackBase64 = await this.convertFileToBase64(this.selectedImages['imageBack']);
    }
    
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
    };
      
      this.httpTestService.postBook(postBody).subscribe({
        next: (response) => {
          this.title = '';
          this.description = '';
          this.genre = 'fantasy';
          this.author = '';
          this.publishedYear = 0;
          this.language = 'french';
          this.state = 'new';
          console.log("✅ Book créé avec succès :", response);
          window.location.reload(); 
        },
        error: (error) => {
          console.error("❌ Erreur lors de la création du livre :", error);
          alert("Tous les champs sont requis, ou l'une des images est trop volumineuse. Veuillez réessayer.");
        }
      });
  }

  checkAuth(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    if (!token) {
      this.router.navigate(['/login']);
      console.log('⛔ Pas de token ou user, accès refusé');
      return;
    }
  }
  clickAccueil() {
    this.router.navigate(['/accueil']);
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
}
