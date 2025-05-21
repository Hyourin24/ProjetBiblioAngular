import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Book } from '../../modules/Book';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, FormsModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {

  title: string = "";
  description: string = "";
  genre: string = "";
  author: string = "";
  publishedYear: number = 0;
  language: "french" | "ukrainian" | "english" = "french";
  state: "new" | "good" | "used" = "new"; 
  images: string[] = [];
  isActive: boolean = true;
  ownerActive: boolean = true;

  bookList: Book[] = [];
  book = new Array<Book>();
   constructor(private router: Router, private httpTestService: ApiService) { }

   ngOnInit() {
    this.httpTestService.getBooksActive().subscribe(books => {
      this.bookList = books
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
}
