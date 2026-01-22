import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { Observable, tap } from 'rxjs';
//import { CookieService } from 'ngx-cookie-service/lib/cookie.service';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private readonly URL = environment.api;
  constructor(private httpClient: HttpClient,
     private cookieService: CookieService) { }

  sendCredentials(email: string, password: string) : Observable<any> {

    const body = {
        username: email,
        password
    };

    console.log('Sending credentials', body);

    return this.httpClient.post<any>(`${this.URL}/auth/login`, body).pipe(
        tap((data) => {
           console.log('Response data:', data);
           const token = data.token;
           if (token) {
             this.cookieService.set('token', token, 4, '/');
             localStorage.setItem('token', token);
             console.log('Token saved:', token);
             
             // Extraer rol del JWT (formato: eyJhbGciOi...)
             try {
               const payload = JSON.parse(atob(token.split('.')[1]));
               const role = payload.role || 'usuario';
               localStorage.setItem('userRole', role);
               localStorage.setItem('userEmail', email);
             } catch (e) {
               console.warn('Could not decode JWT:', e);
               localStorage.setItem('userRole', 'usuario');
               localStorage.setItem('userEmail', email);
             }
           } else {
             console.error('Token not found in response:', data);
           }
        })
    );      
  }

  /**
   * Obtiene el rol del usuario desde localStorage
   */
  getUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  /**
   * Obtiene el email del usuario desde localStorage
   */
  getUserEmail(): string {
    return localStorage.getItem('userEmail') || '';
  }

  /**
   * Verifica si el usuario es admin
   */
  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'admin' || role === 'ADMIN';
  }

  /**
   * Logout - limpia datos
   */
  logout(): void {
    this.cookieService.delete('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    console.log('User logged out');
  }

  /**
   * Registrar nuevo usuario
   */
  registrar(usuarioData: any): Observable<any> {
    const body = {
      username: usuarioData.username,
      email: usuarioData.email,
      password: usuarioData.password,
      roles: ['USUARIO']
    };

    console.log('Registering user', body);

    return this.httpClient.post<any>(`${this.URL}/api/usuarios`, body).pipe(
      tap((data) => {
        console.log('User registered successfully', data);
      })
    );
  }
}


