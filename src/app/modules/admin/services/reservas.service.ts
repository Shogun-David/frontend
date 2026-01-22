import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';

export interface Reserva {
  id?: number;
  sala: string;
  usuario: string;
  fecha: string;
  hora: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private readonly URL = environment.api;

  constructor(private httpClient: HttpClient) { }

  /**
   * Obtener lista de todas las reservas (admin)
   */
  getReservas(): Observable<Reserva[]> {
    return this.httpClient.get<Reserva[]>(`${this.URL}/api/reservas`);
  }

  /**
   * Obtener reserva por ID
   */
  getReservaById(id: number): Observable<Reserva> {
    return this.httpClient.get<Reserva>(`${this.URL}/api/reservas/${id}`);
  }

  /**
   * Crear nueva reserva
   */
  crearReserva(reserva: any): Observable<Reserva> {
    return this.httpClient.post<Reserva>(`${this.URL}/api/reservas`, reserva);
  }

  /**
   * Actualizar reserva
   */
  actualizarReserva(id: number, reserva: any): Observable<Reserva> {
    return this.httpClient.put<Reserva>(`${this.URL}/api/reservas/${id}`, reserva);
  }

  /**
   * Cancelar/Eliminar reserva
   */
  cancelarReserva(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.URL}/api/reservas/${id}`);
  }

  /**
   * Obtener reservas por usuario
   */
  getReservasPorUsuario(usuarioId: number): Observable<Reserva[]> {
    return this.httpClient.get<Reserva[]>(`${this.URL}/api/reservas/usuario/${usuarioId}`);
  }
}
