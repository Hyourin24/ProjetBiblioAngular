import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-event',
  imports: [CommonModule, FormsModule],
  templateUrl: './post-event.component.html',
  styleUrl: './post-event.component.css'
})
export class PostEventComponent {
    user: any = null;
    title: string = ''
    description: string = ''
    images: string = ''
    language: "french" | "ukrainian" | "english" = "french";
    languages: ('french' | 'ukrainian' | 'english')[] = ["french", "ukrainian", "english"];
    usersInEvent: string[] = [];
    eventStartDate: Date = new Date();
    eventEndDate: Date = new Date();
  
    isLoggedIn: boolean = false;
    userId: string = "";
  
    constructor(private router: Router, private route: ActivatedRoute, private httpTestService: ApiService) { }
  
    ngOnInit() {
      this.checkAuth();
  
      const userData = localStorage.getItem('user');
      if (!userData) {
        this.router.navigate(['/login']);
        return;
      }

      let userParsed = JSON.parse(userData);
      this.user = userParsed;
      if (!this.user.admin) {
        this.router.navigate(['/**']); 
        return;
      }
      // Si userData commence par {, c'est un objet, sinon c'est un id
      if (userData.trim().startsWith('{')) {
        try {
          userParsed = JSON.parse(userData);
        } catch (e) {
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
          return;
        }
      } else {
        userParsed = { _id: userData };
      }
      this.userId = userParsed._id;
  
      this.httpTestService.getUserById(userParsed._id).subscribe({
        next: (res) => {
          if (res && typeof res === 'object') {
            if ('data' in res && res.data) {
              this.user = res.data;
            } else {
              this.user = res;
            }
          } else {
            this.user = null;
          }
        },
        error: () => {
          this.user = null;
        }
      });
    }

    selectedImages: { [key: string]: File } = {};

    onImageSelected(event: Event, type: 'images') {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        this.selectedImages[type] = input.files[0];
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
  
    async postEvent() {
      let ImageBase64 = null;
  
      if (this.selectedImages['images']) {
        ImageBase64 = await this.convertFileToBase64(this.selectedImages['images']);
      }
      
  
      const eventBody = {
        title: this.title,
        description: this.description,
        images: ImageBase64,
        language: this.language,
        eventStartDate: this.eventStartDate,
        eventEndDate: this.eventEndDate,
        owner: this.userId // Ajoute bien l'owner ici !
      };
  
      this.httpTestService.postEvent(eventBody).subscribe({
        next: (response) => {
          this.title = '';
          this.description = '';
          this.language = 'french';
          this.eventStartDate = new Date();
          this.eventEndDate = new Date();
          window.location.reload();
        },
        error: (error) => {
          alert("Tous les champs sont requis, ou l'une des images est trop volumineuse. Veuillez réessayer.");
        }
      });
    }
  

    checkAuth(): void {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
  
      if (!token) {
        this.router.navigate(['/login']);
        return;
      }
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
}
