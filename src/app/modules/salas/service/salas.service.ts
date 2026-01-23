import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from '@core/models/page.model';
import { PaginationModel } from '@core/models/pagination.model';
import { SalaModel } from '@core/models/sala.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  private apiUrl = 'http://localhost:8080/salas';

  constructor(private http: HttpClient) { }

  getSalasPagination(pagination: PaginationModel): Observable<Page<SalaModel>> {
    return this.http.post<Page<SalaModel>>(
      `${this.apiUrl}/pagination`,
      pagination
    );
  }

  createSala(payload: SalaModel): Observable<SalaModel> {
    return this.http.post<SalaModel>(this.apiUrl, payload);
  }

  updateSala(id: number, payload: SalaModel): Observable<SalaModel> {
    return this.http.put<SalaModel>(`${this.apiUrl}/${id}`, payload);
  }

  toggleEstadoSala(id: number): Observable<SalaModel> {
    return this.http.patch<SalaModel>(
      `${this.apiUrl}/${id}/estado`,
      null
    );
  }

}
