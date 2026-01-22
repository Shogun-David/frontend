import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class InjectSessionInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  /**
   * Intercepta todas las peticiones HTTP y adjunta el token en el header Authorization
   * @param request Petición HTTP
   * @param next Siguiente handler
   * @returns Observable de la petición
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = this.cookieService.get('token');
    
    // Si no hay token en cookies, intentar desde localStorage
    if (!token) {
      token = localStorage.getItem('token') || '';
    }

    // Si existe token, lo adjunta al header
    if (token) {
      console.log('InjectSessionInterceptor: Adjuntando token al request');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}

