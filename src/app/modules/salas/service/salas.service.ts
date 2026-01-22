import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationModel } from '@core/models/pagination.model';
import { SalaModel } from '@core/models/sala.model';
import { PageResponse } from '@core/models/page.response.model';

@Injectable({
  providedIn: 'root'
})
export class SalasService {

  private readonly API_URL = 'http://localhost:8080/salas';

  constructor(private http: HttpClient) {}

  obtenerSalasDisponibles(): Observable<PageResponse<SalaModel>> {

    const body: PaginationModel = {
      pageNumber: 0,          // 👈 OJO: backend usa base 0
      rowsPerPage: 5,
      filters: [
        { field: 'estado', value: 'D' }
      ],
      sorts: []
    };

    return this.http.post<PageResponse<SalaModel>>(
      `${this.API_URL}/pagination`,
      body
    );
  }
}
