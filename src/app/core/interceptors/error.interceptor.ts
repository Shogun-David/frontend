import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Intercepta errores HTTP y maneja:
   * - 401 Unauthorized: Token expirado o inválido
   * - 403 Forbidden: Permisos insuficientes
   * - Otros errores: Los deja pasar
   * 
   * @param request Petición HTTP
   * @param next Siguiente handler
   * @returns Observable de la petición
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error.status, error.message);

        // NO interceptar errores en rutas de autenticación (login/registro)
        // Dejar que el componente maneje los errores
        const isAuthRoute = request.url.includes('/auth/login') || 
                           (request.url.includes('/api/usuarios') && request.method === 'POST');

        if (isAuthRoute) {
          // Propagar el error sin redirigir
          console.log('Auth route error, letting component handle it');
          return throwError(() => error);
        }

        // 401 Unauthorized - Token expirado o inválido
        if (error.status === 401) {
          console.warn('Token inválido o expirado. Sesión cerrada.');
          
          // Limpiar datos de sesión
          this.authService.logout();
          
          // Redirigir a login
          this.router.navigate(['/auth/login']);
        }

        // 403 Forbidden - Permisos insuficientes (solo para rutas protegidas)
        if (error.status === 403 && !isAuthRoute) {
          console.warn('Acceso denegado: Permisos insuficientes');
          
          // Redirigir a página de inicio o no autorizado
          this.router.navigate(['/home']);
        }

        // Propagar el error para que el componente pueda manejarlo si es necesario
        return throwError(() => error);
      })
    );
  }
}
