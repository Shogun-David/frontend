import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageResponse } from '@core/models/page.response.model';
import { PaginationModel } from '@core/models/pagination.model';
import { ReservaCalendarRequest } from '@core/models/reserva-calendar-request';
import { ReservaListadoAdminModel } from '@core/models/reserva-listado-admin.model';
import { ReservaModel } from '@core/models/reserva.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private readonly API_URL = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) {}

  getReservaById(id: number): Observable<ReservaModel> {
    return this.http.get<ReservaModel>(
      `${this.API_URL}/${id}`
    );
  }


  getByUser(pagination: PaginationModel) : Observable<PageResponse<ReservaModel>> {
    return this.http.post<PageResponse<ReservaModel>>(
      `${this.API_URL}/by-user`, pagination 
    );
  }

  getUserReservasForCalendar(
    request: ReservaCalendarRequest
  ): Observable<ReservaModel[]> {

    return this.http.post<ReservaModel[]>(
      `${this.API_URL}/by-user/calendar`,
      request
    );
  }


   getReservaListadoAdmin( pagination: PaginationModel ): Observable<PageResponse<ReservaListadoAdminModel>> {
    return this.http.post<PageResponse<ReservaListadoAdminModel>>(
      `${this.API_URL}/admin`, pagination
    );
  }


  cancelarReserva(id: number, motivo: string) {
    return this.http.delete<void>(
      `${this.API_URL}/cancelar/${id}`,
      { body: { motivo } }
    );
  }

  create(request: any): Observable<ReservaModel> {
    return this.http.post<ReservaModel>(
      this.API_URL,
      request
    );
  }


}
