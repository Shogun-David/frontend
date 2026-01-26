import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthUser } from '@core/models/auth.user';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@core/models/jwt.payload';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:8080/api/auth';

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router
  ) {
    this.restoreSession();
  }

  // LOGIN
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, {
      username,
      password
    }).pipe(
      tap(response => this.handleAuthentication(response.token))
    );
  }


  registrar(data: {
    username: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  // 🔁 RESTAURAR SESIÓN AL REFRESH
  private restoreSession(): void {
    const token = this.cookieService.get('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (payload.exp * 1000 <= Date.now()) return;

      this.currentUserSubject.next({
        username: payload.sub,
        roles: payload.roles.split(',').map((r: string) => r.trim())
      });
    } catch {
      this.logout();
    }
  }

  isAuthenticated(): boolean {
    const token = this.cookieService.get('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }


  hasRole(role: string): boolean {
    const token = this.cookieService.get('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload.roles.split(',').map((r: string) => r.trim());
      return roles.includes(role);
    } catch {
      return false;
    }
  }


  logout(): void {
    this.cookieService.delete('token', '/');
    this.currentUserSubject.next(null);
  }


  private handleAuthentication(token: string): void {
    try {
      //Decodificamos el token JWT para extraer la información del token del backend
      const decoded: JwtPayload = jwtDecode(token);
      
      // Creamos el objeto AuthUser con los datos extraídos
      const authUser: AuthUser = {
        //idUsers: decoded.idUsers || 0, // Extraer idUsers del token
        username: decoded.sub,
        roles: decoded.roles
      };
      // Calculamos la fecha de expiración de la cookie (basada en el exp del JWT)
      const expirationDate = new Date(decoded.exp * 1000); 
      // Guardamos el token en una cookie
  
      this.cookieService.set(
        'token',
        token,
        expirationDate,
        '/'      
      );

      // Actualizamos el BehaviorSubject para notificar a todos los suscriptores
      this.currentUserSubject.next(authUser);
      this.router.navigate(['/reservas']);

    } catch (error) {
      console.error('Error al decodificar el token:', error);
      this.logout();
    }
  }//fin de handleAuthentication
  
  
}
