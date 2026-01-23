import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from '@core/models/page.model';
import { PaginationModel } from '@core/models/pagination.model';
import { Sala } from '@core/models/sala.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  private apiUrl = 'http://localhost:8080/salas';

  constructor(private http: HttpClient) { }

  getSalasPagination(pagination: PaginationModel): Observable<Page<Sala>> {
    return this.http.post<Page<Sala>>(
      `${this.apiUrl}/pagination`,
      pagination
    );
  }

  createSala(payload: Sala): Observable<Sala> {
    return this.http.post<Sala>(this.apiUrl, payload);
  }

  updateSala(id: number, payload: Sala): Observable<Sala> {
    return this.http.put<Sala>(`${this.apiUrl}/${id}`, payload);
  }

  toggleEstadoSala(id: number): Observable<Sala> {
    return this.http.patch<Sala>(
      `${this.apiUrl}/${id}/estado`,
      null
    );
  }

}
