import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BookServiceService } from '../../services/book-service.service';

@Component({
  selector: 'app-book-id',
  imports: [],
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
    const id = this.bookService.getSelectedBookId();
    console.log("ID reçu dans le composant B :", id);
    return {
      
  
    }
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
