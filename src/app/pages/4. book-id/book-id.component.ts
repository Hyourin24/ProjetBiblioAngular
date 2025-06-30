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
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { addDays } from 'date-fns'; // Si tu utilises date-fns, sinon utilise new Date()


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

  nouveauComment: { title: string, comment: string } = { title: '', comment: '' };
  commentList: CommentWithUser[] = [];
  comment: string = "";
  titleComment: string = "";
  creation: Date = new Date();
  modification: Date = new Date();

  userList: User[] = []
  user: User | null = null

  popupVisible: boolean = false;
  isReserved: boolean = false;
  
  idClick: string | null = null;
  isLoggedIn: boolean = false;
  lougoutVisible: boolean = false;
  // apiService: any; // Remove this line, will inject via constructor

  // Ajout pour la réservation
  isBookReservedByUser: boolean = false;
  bookLoans: any[] = [];

  constructor(
    private bookService: BookServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private httpTestService: ApiService,
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService // Inject ApiService here
  ) {}

  ngOnInit() {
    // Récupération sécurisée de l'utilisateur connecté
    const userData = localStorage.getItem('user');
    let userParsed: any = null;
    if (userData && userData.trim().startsWith('{')) {
      try {
        userParsed = JSON.parse(userData);
      } catch (e) {
        userParsed = null;
      }
    } else if (userData) {
      userParsed = { _id: userData };
    }
    this.userId = userParsed?._id ?? "";

    this.bookId = this.route.snapshot.paramMap.get('id') || '';
    this.checkAuth();

    // Récupère l'utilisateur connecté
    if (this.userId) {
      this.httpTestService.getUserById(this.userId).subscribe(user => {
        // Assigne directement l'utilisateur récupéré
        this.user = user;
      });
    }

    // Récupère les infos du livre
    this.httpTestService.getBooksById(this.bookId).subscribe(book => {
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
      this.book = book;

      // Vérifie si le livre est déjà réservé par l'utilisateur
      if (this.user && this.user.bookReserved) {
        this.isBookReservedByUser = this.user.bookReserved.includes(this.bookId);
      }
    });

    // Récupère les commentaires et les utilisateurs
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

    // Récupère le livre avec l'utilisateur propriétaire
    forkJoin({
      bookJoin: this.httpTestService.getBooksById(this.bookId),
      userJoin: this.httpTestService.getUser()
    }).subscribe(({ bookJoin, userJoin }) => {
      this.userList = userJoin;
      const userMap = this.userList.find(user => user._id === bookJoin.owner);
      this.book = {
        ...bookJoin,
        user: userMap
      };
    });

    // Après avoir récupéré le bookId :
    this.httpTestService.getLoans().subscribe((loansRes: any) => {
      const loans = Array.isArray(loansRes) ? loansRes : loansRes.data;
      console.log('Loans reçus:', loans);
      this.bookLoans = loans.filter((loan: any) => {
        if (!loan.bookId) return false;
        return String(loan.bookId) === String(this.bookId);
      });
      console.log('Loans filtrés:', this.bookLoans);
    });

    // Récupère tous les utilisateurs pour faire le lien avec les loans
    this.httpTestService.getUser().subscribe((users: any[]) => {
      this.httpTestService.getLoans().subscribe((loansRes: any) => {
        const loans = Array.isArray(loansRes) ? loansRes : loansRes.data;
        this.bookLoans = loans
          .filter((loan: any) => loan.bookId && String(loan.bookId) === String(this.bookId))
          .map((loan: any) => {
            // Cherche l'utilisateur correspondant à userId
            const user = users.find(u => String(u._id) === String(loan.userId));
            return {
              ...loan,
              user: user || null
            };
          });
        console.log('Loans filtrés avec user:', this.bookLoans);
      });
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
        
  createComment() {
    const newComment = {
      title: this.nouveauComment.title,
      comment: this.nouveauComment.comment,
    };

    this.httpTestService.postCommentBook(this.bookId, newComment).subscribe({
      next: () => {
        this.nouveauComment.title = "";
        this.nouveauComment.comment = "";
        window.location.reload(); 
      },
      error: () => {
        alert("Le titre et la description du commentaire sont requis.");
      }
    });
  }

  reserveBook() {
    if (!this.userId) {
      alert("Utilisateur non identifié.");
      return;
    }
    // Empêche la double réservation
    if (this.isBookReservedByUser) {
      alert("Vous avez déjà réservé ce livre.");
      return;
    }

    // 1. Cherche les loans existants pour ce livre
    this.apiService.getLoans().subscribe((loansRes: any) => {
      const loans = Array.isArray(loansRes) ? loansRes : loansRes.data;
      // Filtre les loans de ce livre, triés par endDate décroissante
      const bookLoans = loans
        .filter((loan: any) => loan.book && loan.book._id === this.bookId)
        .sort((a: any, b: any) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

      let startDate: Date;
      let endDate: Date;

      const today = new Date();
      if (bookLoans.length > 0 && new Date(bookLoans[0].endDate) > today) {
        // Le dernier prêt finit dans le futur, commence le lendemain
        startDate = addDays(new Date(bookLoans[0].endDate), 1);
      } else {
        // Pas de prêt futur, commence aujourd'hui
        startDate = today;
      }
      endDate = addDays(startDate, 30);

      // 2. Crée le loan côté backend
      interface LoanPayload {
        book: string;
        user: string;
        startDate: string;
        endDate: string;
      }

      interface ApiError {
        error?: {
          message?: string;
        };
      }

      this.apiService.createLoan(this.bookId, {
        user: this.userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }).subscribe({
        next: (): void => {
          // 3. Réserve le livre côté user (optionnel si tu veux garder la logique existante)
          this.httpTestService.postReservedBook(this.bookId, this.userId).subscribe({
            next: (): void => {
              this.isReserved = true;
              this.popupVisible = true;
              this.isBookReservedByUser = true;
              this.cdRef.detectChanges();
            },
            error: (err: ApiError): void => {
              alert(err.error?.message || "Erreur lors de la réservation.");
            }
          });
        },
        error: (err: ApiError): void => {
          alert(err.error?.message || "Erreur lors de la création du prêt.");
        }
      });
    });
  }
  
  clickComment() {
    const postComment = document.querySelector(".postComment") as HTMLElement;
    if (postComment) postComment.style.display = "block";
    this.popupVisible = true;
  }

  clickCrossComment() {
    const postComment = document.querySelector(".postComment") as HTMLElement;
    if (postComment) postComment.style.display = "none";
    this.popupVisible = false;
  }

  clickDemandReserve() {
    const demandReserve = document.querySelector(".demandReserve") as HTMLElement;
    if (demandReserve) demandReserve.style.display = "block";
    this.popupVisible = true;
  }

  clickCrossDemandReserve() {
    const demandReserve = document.querySelector(".demandReserve") as HTMLElement;
    const bookReserved = document.querySelector(".bookReserved") as HTMLElement;
    if (demandReserve) demandReserve.style.display = "none";
    if (bookReserved) bookReserved.style.display = "none";
    this.popupVisible = false;
  }

  clickLougout() {
    const deconnexion = document.querySelector(".deconnexion") as HTMLElement;
    if (deconnexion) deconnexion.style.display = "block";
    this.lougoutVisible = true;
  }
  
  clickCrossLougout() {
    const deconnexion = document.querySelector(".deconnexion") as HTMLElement;
    if (deconnexion) deconnexion.style.display = "none";
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
      error: () => {
        alert("Erreur lors de la déconnexion.");
      }
    });
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
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }
    
}
