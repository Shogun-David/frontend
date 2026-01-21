import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private cookieService: CookieService,
    private router: Router
  ) {}

  /**
   * Verifica si existe un token válido antes de permitir acceso a rutas protegidas
   * @returns true si existe token, false si no y redirige al login
   */
  canActivate(): boolean {
    const token = this.cookieService.get('token');
    
    if (token) {
      console.log('AuthGuard: Acceso permitido - Token válido');
      return true;
    }
    
    console.warn('AuthGuard: Acceso denegado - No hay token');
    this.router.navigate(['/auth/login']);
    return false;
  }
}
