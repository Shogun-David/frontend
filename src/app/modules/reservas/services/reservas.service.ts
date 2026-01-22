import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageResponse } from '@core/models/page.response.model';
import { ReservaAdminModel } from '@core/models/reserva.admin.model';
import { ReservaModel } from '@core/models/reserva.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private readonly API_URL = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) {}

  getByUser(
    userId: number,
    estado?: string,
    page: number = 1,
    size: number = 10
  ): Observable<PageResponse<ReservaModel>> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<PageResponse<ReservaModel>>(
      `${this.API_URL}/by-user/${userId}`,
      { params }
    );
  }

  getReservationsAdmin(
    estado?: string,
    page: number = 1,
    size: number = 10
  ): Observable<PageResponse<ReservaAdminModel>> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<PageResponse<ReservaAdminModel>>(
      `${this.API_URL}/admin`,
      { params }
    );
  }

  cancelarReserva(id: number, motivo: string) {
    return this.http.delete<void>(
      `${this.API_URL}/cancelar/${id}`,
      { body: { motivo } }
    );
  }

  getReservasCalendario(userId: number) {
    return this.http.get<any>(
      `${this.API_URL}/by-user/${userId}`,
      { params: { page: 1, size: 10 } } // calendario = sin paginar
    );
  }

  create(request: any): Observable<ReservaModel> {
    return this.http.post<ReservaModel>(
      this.API_URL,
      request
    );
  }
}
