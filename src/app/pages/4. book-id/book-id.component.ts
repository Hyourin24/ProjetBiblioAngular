import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { BookServiceService } from '../../services/book-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Book, BookWithUser } from '../../modules/Book';
import { User } from '../../modules/User';
import { CommentBook, CommentWithUser } from '../../modules/CommentBook';
import { ActivatedRoute, Router } from '@angular/router';
import { addDays } from 'date-fns';

@Component({
  selector: 'app-book-id',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-id.component.html',
  styleUrl: './book-id.component.css'
})
export class BookIdComponent implements OnInit {
  // --- Book & User Info ---
  book: BookWithUser | null = null;
  user: User | null = null;
  userId: string = '';
  bookId: string = '';

  // --- Book Details ---
  title: string = '';
  description: string = '';
  genre: string = 'fantasy';
  author: string = '';
  publishedYear: number = 0;
  language: string = 'french';
  state: string = 'new';
  addedAt: Date = new Date();
  imageCouverture: string = '';
  imageBack: string = '';
  imageInBook: string = '';

  // --- Comments ---
  nouveauComment = { title: '', comment: '' };
  commentList: CommentWithUser[] = [];
  userList: User[] = [];

  // --- UI State ---
  popupVisible: boolean = false;
  isReserved: boolean = false;
  isBookReservedByUser: boolean = false;
  isLoggedIn: boolean = false;
  lougoutVisible: boolean = false;

  // --- Loans for this book ---
  bookLoans: any[] = [];

  constructor(
    private bookService: BookServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private httpTestService: ApiService,
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // 1. Récupère l'utilisateur connecté
    const userData = localStorage.getItem('user');
    let userParsed: any = null;
    if (userData && userData.trim().startsWith('{')) {
      try { userParsed = JSON.parse(userData); } catch { userParsed = null; }
    } else if (userData) {
      userParsed = { _id: userData };
    }
    this.userId = userParsed?._id ?? '';
    this.bookId = this.route.snapshot.paramMap.get('id') || '';
    this.checkAuth();

    // 2. Récupère les infos utilisateur
    if (this.userId) {
      this.httpTestService.getUserById(this.userId).subscribe(user => {
        this.user = user;
      });
    }

    // 3. Récupère les infos du livre
    this.httpTestService.getBooksById(this.bookId).subscribe(book => {
      this.title = book.title;
      this.description = book.description;
      this.genre = book.genre;
      this.author = book.author;
      this.publishedYear = book.publishedYear;
      this.language = book.language;
      this.state = book.state;
      this.imageCouverture = book.imageCouverture ?? '';
      this.imageBack = book.imageBack ?? '';
      this.imageInBook = book.imageInBook ?? '';
      this.addedAt = book.addedAt;
      this.book = book;
      // Vérifie si le livre est déjà réservé par l'utilisateur
      if (this.user && this.user.bookReserved) {
        this.isBookReservedByUser = this.user.bookReserved.includes(this.bookId);
      }
    });

    // 4. Récupère les commentaires et utilisateurs pour affichage enrichi
    forkJoin({
      commentJoin: this.httpTestService.getCommentsByBook(this.bookId),
      userJoin: this.httpTestService.getUser()
    }).subscribe(({ commentJoin, userJoin }) => {
      this.userList = userJoin;
      this.commentList = commentJoin.map(comment => ({
        ...comment,
        user: this.userList.find(u => u._id === comment.owner)
      }));
    });

    // 5. Récupère les loans pour ce livre avec infos utilisateur, seulement status 'confirmed'
    this.httpTestService.getUser().subscribe((users: any[]) => {
      this.httpTestService.getLoans().subscribe((loansRes: any) => {
        const loans = Array.isArray(loansRes) ? loansRes : loansRes.data;
        this.bookLoans = loans
          .filter((loan: any) =>
            loan.bookId &&
            String(loan.bookId) === String(this.bookId) &&
            loan.status === 'confirmed'
          )
          .map((loan: any) => ({
            ...loan,
            user: users.find((u: any) => String(u._id) === String(loan.userId)) || null
          }));
      });
    });
  }

  // --- Navigation ---
  clickLogin() { this.router.navigate(['/login']); }
  clickRegister() { this.router.navigate(['/inscription']); }
  clickProfil() { this.router.navigate(['/profil']); }
  clickAccueil() { this.router.navigate(['/accueil']); }

  // --- Commentaires ---
  createComment() {
    const newComment = { title: this.nouveauComment.title, comment: this.nouveauComment.comment };
    this.httpTestService.postCommentBook(this.bookId, newComment).subscribe({
      next: () => {
        this.nouveauComment.title = '';
        this.nouveauComment.comment = '';
        window.location.reload();
      },
      error: () => alert("Le titre et la description du commentaire sont requis.")
    });
  }

  // --- Réservation d'un livre ---
  reserveBook() {
    if (!this.userId) { alert("Utilisateur non identifié."); return; }
    if (this.isBookReservedByUser) { alert("Vous avez déjà réservé ce livre."); return; }

    this.apiService.getLoans().subscribe((loansRes: any) => {
      const loans = Array.isArray(loansRes) ? loansRes : loansRes.data;
      // Prend le dernier prêt (endDate la plus grande) pour ce livre
      const bookLoans = loans
        .filter((loan: any) => String(loan.bookId) === String(this.bookId))
        .sort((a: any, b: any) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

      let startDate: Date;
      let endDate: Date;
      const today = new Date();
      if (bookLoans.length > 0 && new Date(bookLoans[0].endDate) > today) {
        startDate = addDays(new Date(bookLoans[0].endDate), 1);
      } else {
        startDate = today;
      }
      endDate = addDays(startDate, 30);

      this.apiService.createLoan(this.bookId, {
        user: this.userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }).subscribe({
        next: () => {
          this.httpTestService.postReservedBook(this.bookId, this.userId).subscribe({
            next: () => {
              this.isReserved = true;
              this.popupVisible = true;
              this.isBookReservedByUser = true;
              this.cdRef.detectChanges();
            },
            error: err => alert(err.error?.message || "Erreur lors de la réservation.")
          });
        },
        error: err => alert(err.error?.message || "Erreur lors de la création du prêt.")
      });
    });
  }

  // --- UI Popups ---
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
      error: () => alert("Erreur lors de la déconnexion.")
    });
  }

  // --- Traductions ---
  translateLanguage(lang: string): string {
    switch (lang?.toLowerCase()) {
      case 'french': return 'Français';
      case 'english': return 'Anglais';
      case 'ukrainian': return 'Ukrainien';
      default: return lang;
    }
  }
  translateState(et: string): string {
    switch (et?.toLowerCase()) {
      case 'new': return 'Neuf';
      case 'good': return 'Bon état';
      case 'used': return 'Usé';
      default: return et;
    }
  }
  translateGenre(genre: string): string {
    switch (genre?.toLowerCase()) {
      case 'fantasy': return 'Fantastique';
      case 'science-fiction': return 'Science-fiction';
      case 'romance': return 'Romance';
      case 'mystery': return 'Mystère';
      case 'non-fiction': return 'Non-fiction';
      case 'historical': return 'Historique';
      case 'thriller': return 'Thriller';
      case 'horror': return 'Horreur';
      case 'biography': return 'Biographie';
      case 'self-help': return 'Développement personnel';
      case "children's": return 'Jeunesse';
      case 'young adult': return 'Jeunes adultes';
      case 'poetry': return 'Poésie';
      case 'classics': return 'Classiques';
      case 'manga': return 'Manga';
      case 'comics': return 'Bandes dessinées';
      case 'adventure': return 'Aventure';
      case 'educative': return 'Éducatif';
      case 'cookbook': return 'Livre de cuisine';
      case 'travel': return 'Voyage';
      case 'humor': return 'Humour';
      default: return genre;
    }
  }

  // --- Auth ---
  checkAuth(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }
}
