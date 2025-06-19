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
  styleUrl: './poster.component.css'
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
    author: string = "";
    publishedYear: number = 0;
    language: "french" | "ukrainian" | "english" = "french";
    state: "new" | "good" | "used" = "new"; 
    addedAt: Date = new Date();
    imageCouverture: string = ""
    imageBack: string = ""
    imageInBook: string = ""

    nouveauBook: {title: string, description: string, genre: string, author: string,
    publishedYear: number, language: string, state: string, imageCouverture: string, imageBack: string, imageInBook: string} = 
    { title: '', description: '', genre: 'fantasy', author: '', publishedYear: 0, language: 'french', state: 'new', 
    imageCouverture: '', imageBack: '', imageInBook: '' };

    postBook() {
      const newComment = {
        title: this.nouveauBook.title,
        description: this.nouveauBook.description,
        genre: this.nouveauBook.genre,
        author: this.nouveauBook.author,
        publishedYear: this.nouveauBook.publishedYear,
        language: this.nouveauBook.language,
        state: this.nouveauBook.state,
        imageVouverture: this.nouveauBook.imageCouverture,
        imageBack: this.nouveauBook.imageBack,
        imageInBook: this.nouveauBook.imageInBook
      };

      this.httpTestService.postCommentBook(this.bookId, newComment).subscribe({
        next: (response) => {
          this.nouveauBook.title = '';
          this.nouveauBook.description = '';
          this.nouveauBook.genre = 'fantasy';
          this.nouveauBook.author = '';
          this.nouveauBook.publishedYear = 0;
          this.nouveauBook.language = 'french';
          this.nouveauBook.state = 'new';
          this.nouveauBook.imageCouverture = '';
          this.nouveauBook.imageBack = '';
          this.nouveauBook.imageInBook = '';
          console.log("✅ Book créé avec succès :", response);
          window.location.reload(); 
        },
        error: (error) => {
          console.error("❌ Erreur lors de la création du livre :", error);
          alert("Tous les champs sont requis");
        }
      });
  }
}
