import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';

export interface Usuario {
  id?: number;
  username: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private readonly URL = environment.api;

  constructor(private httpClient: HttpClient) { }

  /**
   * Obtener lista de todos los usuarios
   */
  getUsuarios(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(`${this.URL}/api/usuarios`);
  }

  /**
   * Obtener usuario por ID
   */
  getUsuarioById(id: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.URL}/api/usuarios/${id}`);
  }

  /**
   * Crear nuevo usuario (admin)
   */
  crearUsuario(usuario: any): Observable<Usuario> {
    const body = {
      username: usuario.username,
      email: usuario.email,
      password: usuario.password,
      roles: usuario.roles || ['USUARIO']
    };
    return this.httpClient.post<Usuario>(`${this.URL}/api/usuarios`, body);
  }

  /**
   * Actualizar usuario
   */
  actualizarUsuario(id: number, usuario: any): Observable<Usuario> {
    return this.httpClient.put<Usuario>(`${this.URL}/api/usuarios/${id}`, usuario);
  }

  /**
   * Eliminar usuario
   */
  eliminarUsuario(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.URL}/api/usuarios/${id}`);
  }

  /**
   * Cambiar rol de usuario
   */
  cambiarRol(id: number, roles: string[]): Observable<Usuario> {
    return this.httpClient.put<Usuario>(`${this.URL}/api/usuarios/${id}/roles`, { roles });
  }
}
