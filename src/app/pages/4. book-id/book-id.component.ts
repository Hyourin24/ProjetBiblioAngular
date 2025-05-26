import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BookServiceService } from '../../services/book-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-id',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-id.component.html',
  styleUrl: './book-id.component.css'
})
export class BookIdComponent {

  bookId: string = "";
  title: string = "";
  description: string = "";
  genre: string = "";
  author: string = "";
  publishedYear: number = 0;
  language: "french" | "ukrainian" | "english" = "french";
  state: "new" | "good" | "used" = "new"; 
  images: string[] = [];

  constructor(private bookService: BookServiceService) {}

  ngOnInit() {
    this.bookService.selectedBook$.subscribe(book => {
      if (book) {
        this.title = book.title;
        this.description = book.description;
        this.genre = book.genre;
        this.author = book.author;
        this.publishedYear = book.publishedYear;
        this.language = book.language;
        this.state = book.state;
        this.images = book.images ?? []
      }
      console.log("Book details:", book);
      console.log("Title:", this.title);
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
    
}
