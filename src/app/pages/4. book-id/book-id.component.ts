import { Component } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { BookServiceService } from '../../services/book-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Book, BookWithUser } from '../../modules/Book';
import { User } from '../../modules/User';
import { CommentBook } from '../../modules/CommentBook'
import { CommentWithUser } from '../../modules/CommentBook';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-book-id',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-id.component.html',
  styleUrl: './book-id.component.css'
})
export class BookIdComponent {
  bookList: Book[] = [];
  bookClick = ""
  book: BookWithUser | null = null;

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

  nouveauComment: { title: string, comment: string } = { title: '', comment: '' };
  commentList: CommentWithUser[] = [];
  comment: string = "";
  titleComment: string = "";
  creation: Date = new Date();
  modification: Date = new Date();

  userList: User[] = []
  user: User | null = null

  popupVisible: boolean = false;
  
  idClick: string | null = null;
  utilisateurClicke: User | null = null;
  

  constructor(private bookService: BookServiceService, private route: ActivatedRoute, private httpTestService: ApiService ) {}

  ngOnInit() {
    const bookId = this.route.snapshot.paramMap.get('id');
    this.idClick = this.route.snapshot.paramMap.get('id');
    console.log("ID livre dans l'URL :", bookId);

    if (this.idClick) {
      this.httpTestService.getBooksById(this.idClick).subscribe(book => {
        console.log("📘 Détails du livre :", book);
        // assignation de toutes les valeurs à tes propriétés ici
        if (this.idClick) {
          this.bookId = this.idClick;
          this.title = book.title;
          this.description = book.description;
          this.genre = book.genre;
          this.author = book.author;
          this.publishedYear = book.publishedYear;
          this.language = book.language;
          this.state = book.state;
          this.imageCouverture = book.imageCouverture ?? "";
          this.imageBack = book.imageBack ?? "";
          this.imageInBook = book.imageInBook ?? "";
          this.addedAt = book.addedAt;
        }
        forkJoin({
          commentJoin: this.httpTestService.getCommentsByBook(this.bookId),
          userJoin: this.httpTestService.getUser()
        }).subscribe(({ commentJoin, userJoin }) => {
          this.userList = userJoin;
          this.commentList = commentJoin.map(comment => {
            const userMap = this.userList.find(user => user._id === comment.owner);
            return {
              ...comment,
              user: userMap
            };
          });
        });
        forkJoin({
          bookJoin: this.httpTestService.getBooksById(this.bookId),
          userJoin: this.httpTestService.getUser()
        }).subscribe(({ bookJoin, userJoin }) => {
          this.userList = userJoin;
          this.book = bookJoin
          const userMap = this.userList.find(user => user._id === bookJoin.owner);
          this.book = {
            ...bookJoin,
            user: userMap
          };
        });
      });
    }

  }
        
  
      
    
    
        
  createComment() {
      const newComment = {
        title: this.nouveauComment.title,
        comment: this.nouveauComment.comment,
      };

      this.httpTestService.postCommentBook(this.bookId, newComment).subscribe({
        next: (response) => {
          console.log("Comment crée", response);
          this.nouveauComment.title = "";
          this.nouveauComment.comment = "";
          console.log("Commentaire ajouté avec succès", this.nouveauComment);
          window.location.reload(); 
        },
        error: (error) => {
          console.error("Erreur création :", error);
          alert("Le titre et la description du commentaire sont requis.");
        }
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

  clickComment() {
    const postComment = document.querySelector(".postComment") as HTMLElement;
    postComment.style.display = "block";
    this.popupVisible = true;
  }

  clickCrossComment() {
    const postComment = document.querySelector(".postComment") as HTMLElement;
    postComment.style.display = "none";
    this.popupVisible = false;
  }
    
}
