import { Component, OnInit } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  selector: 'app-slide-bar',
  templateUrl: './slide-bar.component.html',
  styleUrls: ['./slide-bar.component.css']
})
export class SlideBarComponent implements OnInit {

  isAdmin = false;
  userEmail = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.userEmail = this.authService.getUserEmail();
    console.log('SlideBar - Admin:', this.isAdmin, 'Email:', this.userEmail);
  }

  logout(): void {
    this.authService.logout();
    // Aquí agregarás la redirección al login
    // this.router.navigate(['/auth/login']);
  }
}
