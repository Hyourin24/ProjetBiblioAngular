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

    // nouveauBook: {title: string, description: string, genre: string, author: string,
    // publishedYear: number, language: string, state: string, imageCouverture: string, imageBack: string, imageInBook: string} = 
    // { title: '', description: '', genre: 'fantasy', author: '', publishedYear: 0, language: 'french', state: 'new', 
    // imageCouverture: '', imageBack: '', imageInBook: '' };

    postBook() {
      const newComment = {
        title: this.title,
        description: this.description,
        genre: this.genre,
        author: this.author,
        publishedYear: this.publishedYear,
        language: this.language,
        state: this.state,
        imageVouverture: this.imageCouverture,
        imageBack: this.imageBack,
        imageInBook: this.imageInBook
      };

      this.httpTestService.postCommentBook(this.bookId, newComment).subscribe({
        next: (response) => {
          this.title = '';
          this.description = '';
          this.genre = 'fantasy';
          this.author = '';
          this.publishedYear = 0;
          this.language = 'french';
          this.state = 'new';
          this.imageCouverture = '';
          this.imageBack = '';
          this.imageInBook = '';
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
