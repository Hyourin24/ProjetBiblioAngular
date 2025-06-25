import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../modules/User';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  admin: boolean = false;
  name: string = "";
  phone: string = "";
  adress: string = "";
  city: string = "";
  postalCode: string = "";
  email: string = "";
  
  
  constructor(private router: Router, private httpTestService: ApiService) { }
  ngOnInit() {
    this.httpTestService.getUser().subscribe(email => {
      
    });
  }

}
