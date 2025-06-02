import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Book } from '../../modules/Book';
import { BookServiceService } from '../../services/book-service.service';
import { User } from '../../modules/User';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, FormsModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  bookId: string = "";
  title: string = "";
  description: string = "";
  genre: string = "";
  author: string = "";
  publishedYear: number = 0;
  language: 'french' | 'ukrainian' | 'english' | '' = '';
  languages: ('french' | 'ukrainian' | 'english')[] = [];
  state: "new" | "good" | "used" = "new"; 
  states: ("new" | "good" | "used")[] = [];
  images: string[] = [];
  isActive: boolean = true;
  ownerActive: boolean = true;

  bookList: Book[] = [];
  bookClick = ""
  book = new Array<Book>();

  resultatsFiltres: Book[] = [];
  recherche: string = '';
  isLoggedIn: boolean = false;
   constructor(private router: Router, private bookService: BookServiceService, private httpTestService: ApiService) { }

   ngOnInit() {
    this.checkAuth();
    this.httpTestService.getBooksActive().subscribe(books => {
      this.bookList = books
      this.resultatsFiltres = books; // 👈 Ajout essentiel
      this.languages = [...new Set(books.map(book => book.language))] as ('french' | 'ukrainian' | 'english')[];
      this.states = [...new Set(books.map(book => book.state))] as ("new" | "good" | "used")[];
      console.log(this.bookList);
    
      this.bookList.forEach(book => {
        return {
          title: book.title,
          description: book.description,
          genre: book.genre,
          author: book.author,
          publishedYear: book.publishedYear,
          language: book.language,
          state: book.state,
          images: book.images,
          isActive: book.isActive,
        }
      });
    });
  }
clickLogin() {
      this.router.navigate(['/login']);
}

clickRegister(){
      this.router.navigate(['/inscription']);
    
  }

  clickLogout() {
    this.httpTestService.deconnexion().subscribe({
      next: () => {
        console.log("Déconnexion réussie");
        localStorage.removeItem('token');
        this.isLoggedIn = false;
      },
      error: (error) => {
        console.error("Erreur lors de la déconnexion :", error);
      }
    });
  }

  clickBook(book: Book) {
    console.log("Book cliqué :", book._id); // ou book.id
    this.httpTestService.getBooksById(book._id).subscribe(bookDetails => {
      console.log("📚 Détails du livre :", bookDetails);
      this.bookService.setSelectedBook(bookDetails);
      this.router.navigate(['/book'])
    });
  }
  
  rechercheResult(): void {
    const term = this.recherche?.toLowerCase().trim() || '';
    this.resultatsFiltres = this.bookList.filter(book =>
      book.title.toLowerCase().startsWith(term)
    );
  }
  filtrerParLangue(): void {
    const langue = this.language;
    if (!langue) {
      this.resultatsFiltres = this.bookList; // toutes les langues
      return;
    }
    this.resultatsFiltres = this.bookList.filter(book =>
      book.language === langue
    );
  }
  filtrerParEtat(): void {
    const etat = this.state;
    if (!etat) {
      this.resultatsFiltres = this.bookList; // tous les états
      return;
    }
    this.resultatsFiltres = this.bookList.filter(book =>
      book.state === etat
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
  checkAuth(): void {
  const token = localStorage.getItem('token'); // ou autre nom utilisé
  this.isLoggedIn = !!token;
}
}
