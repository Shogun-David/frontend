import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Verifica si el usuario es admin antes de permitir acceso a rutas admin
   * @returns true si es admin, false si no y redirige al login
   */
  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      console.log('AdminGuard: Acceso permitido - Usuario es admin');
      return true;
    }
    
    console.warn('AdminGuard: Acceso denegado - Usuario no es admin');
    this.router.navigate(['/auth/login']);
    return false;
  }
}
