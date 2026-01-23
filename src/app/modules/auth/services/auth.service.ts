import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthUser } from '@core/models/auth.user';

interface LoginResponse {
  token: string;
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:8080/auth';

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private cookieService: CookieService,
    private http: HttpClient
  ) {
    this.restoreSession();
  }

  // 🔐 LOGIN
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, {
      username,
      password
    }).pipe(
      tap(response => this.setSession(response))
    );
  }

  // 💾 GUARDAR SESIÓN
  private setSession(response: LoginResponse): void {
    this.cookieService.set('token', response.token, {
      path: '/',
      sameSite: 'Lax'
    });

    this.currentUserSubject.next({
      username: response.username,
      roles: response.roles
    });
  }

  registrar(data: {
    username: string;
    email: string;
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
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.roles.includes(role) ?? false;
  }

  logout(): void {
    this.cookieService.delete('token', '/');
    this.currentUserSubject.next(null);
  }
}
