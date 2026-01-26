import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageResponse } from '@core/models/page.response.model';
import { Observable } from 'rxjs';

export interface UsuarioResponseDto {
  idUsuario: number;
  username: string;
  estado: string;
  fechaCreacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/api/usuarios';

    constructor(private http: HttpClient) {}

  getUsuariosPagination(body: any): Observable<PageResponse<UsuarioResponseDto>> {
    return this.http.post<PageResponse<UsuarioResponseDto>>(
      `${this.baseUrl}/pagination`,
      body
    );
  }

  deshabilitarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {});
  }
}
