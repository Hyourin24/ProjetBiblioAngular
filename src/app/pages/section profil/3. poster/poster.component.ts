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

    // nouveauBook: {title: string, description: string, genre: string, author: string,
    // publishedYear: number, language: string, state: string, imageCouverture: string, imageBack: string, imageInBook: string} = 
    // { title: '', description: '', genre: 'fantasy', author: '', publishedYear: 0, language: 'french', state: 'new', 
    // imageCouverture: '', imageBack: '', imageInBook: '' };

    ngOnInit() {
     
  
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

    postBook() {
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('description', this.description);
      formData.append('genre', this.genre);
      formData.append('author', this.author);
      formData.append('publishedYear', this.publishedYear.toString());
      formData.append('language', this.language);
      formData.append('state', this.state);

      formData.append('imageCouverture', this.selectedImages['imageCouverture']);   
      formData.append('imageBack', this.selectedImages['imageBack']);
      formData.append('imageInBook', this.selectedImages['imageInBook']);
      
      console.log("📤 Données envoyées :", formData);
      console.log("📤 Données envoyées :");
      for (let pair of formData.entries()) {
        console.log(`✅ ${pair[0]}:`, pair[1]);
      }
      

      this.httpTestService.postBook(formData).subscribe({
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
          alert("Tous les champs sont requis");
        }
      });
  }
}
