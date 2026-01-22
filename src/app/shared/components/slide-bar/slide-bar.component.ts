import { Component } from '@angular/core';
import { AuthUser } from '@core/models/auth.user';
import { AuthService } from '@modules/auth/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-slide-bar',
  templateUrl: './slide-bar.component.html',
  styleUrls: ['./slide-bar.component.css']
})
export class SlideBarComponent {

  user$: Observable<AuthUser | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout();
  }

  isAdmin(user: AuthUser): boolean {
    return user.roles.includes('ADMIN');
  }
}
