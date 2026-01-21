import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceMock {
  
  private readonly credentials = [
    {
      id: 1,
      email: 'admin@example.com',
      password: 'admin123',
      rol: 'admin',
      nombre: 'Juan Admin'
    },
    {
      id: 2,
      email: 'usuario@example.com',
      password: 'user123',
      rol: 'usuario',
      nombre: 'Pedro Usuario'
    },
    {
      id: 3,
      email: 'maria@example.com',
      password: 'maria123',
      rol: 'admin',
      nombre: 'María Admin'
    }
  ];

  constructor(private cookieService: CookieService) { }

  /**
   * Simula el login con credenciales locales
   * Devuelve un token fake y la información del usuario con su rol
   */
  sendCredentials(email: string, password: string): Observable<any> {
    const user = this.credentials.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      // Generar un token fake basado en el rol
      const fakeToken = 'fake-jwt-' + user.rol + '-' + Date.now();
      
      const response = {
        tokenSession: fakeToken,
        token: fakeToken,
        accessToken: fakeToken,
        user: {
          id: user.id,
          email: user.email,
          rol: user.rol,
          nombre: user.nombre
        }
      };

      // Simula delay de red y guarda el token
      return of(response).pipe(
        delay(500),
        tap((data) => {
          console.log('Mock Response data:', data);
          const token = data.tokenSession || data.token || data.accessToken;
          if (token) {
            this.cookieService.set('token', token, 4, '/');
            // Guardar también el rol para luego verificarlo
            localStorage.setItem('userRole', user.rol);
            localStorage.setItem('userEmail', user.email);
            console.log('Token and role saved:', token, user.rol);
          }
        })
      );
    }

    // Simular error de credenciales inválidas
    return throwError(() => {
      console.error('Mock Error: Credenciales inválidas para', email);
      return new Error('Correo o contraseña incorrectos');
    });
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
    return this.getUserRole() === 'admin';
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
}
