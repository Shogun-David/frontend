import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UsuarioResponseDto {
  idUsuario: number;
  username: string;
  email: string;
  roles: string[];
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:8080/api/usuarios';

  constructor(private httpClient: HttpClient) { }

  getUsuarios(): Observable<UsuarioResponseDto[]> {
    return this.httpClient.get<UsuarioResponseDto[]>(this.baseUrl);
  }
}
