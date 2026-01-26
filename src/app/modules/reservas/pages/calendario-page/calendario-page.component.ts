import { Component } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { ReservasService } from '@modules/reservas/services/reservas.service';
import { ReservaCalendarRequest } from '@core/models/reserva-calendar-request';

@Component({
  selector: 'app-calendario-page',
  templateUrl: './calendario-page.component.html'
})
export class CalendarioPageComponent {

  eventos: EventInput[] = [];
  loading = false;

  estadoFiltro = '';
  salaFiltro = '';

  private lastStart?: Date;
  private lastEnd?: Date;

  constructor(private reservasService: ReservasService) {}

  onRangoCalendarioChange(event: { start: Date; end: Date }): void {
    this.lastStart = event.start;
    this.lastEnd = event.end;
    this.cargarReservas();
  }

  cargarReservas(): void {
    if (!this.lastStart || !this.lastEnd) return;

    this.loading = true;

    const request: ReservaCalendarRequest = {
      start: this.lastStart.toISOString(),
      end: this.lastEnd.toISOString(),
      filters: []
    };

    if (this.estadoFiltro) {
      request.filters.push({ field: 'estado', value: this.estadoFiltro });
    }

    if (this.salaFiltro) {
      request.filters.push({ field: 'sala', value: this.salaFiltro });
    }

    
    this.reservasService.getUserReservasForCalendar(request)
      .subscribe({
        next: res => {
          
          this.eventos = res.map(r => ({
            
            id: r.idReserva.toString(),
            title: r.sala,
            start: r.fechaInicio,
            end: r.fechaFin,
            color: this.colorPorEstado(r.estado),
            extendedProps: {
              hora: `${this.formatHora(r.fechaInicio)} - ${this.formatHora(r.fechaFin)}`
            }
          }));
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  filtrar(): void {
    this.cargarReservas();
  }

  limpiarFiltros(): void {
    this.estadoFiltro = '';
    this.salaFiltro = '';
    this.cargarReservas();
  }

  private formatHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private colorPorEstado(estado: string): string {
    switch (estado) {
      case 'ACTIVA': return '#22c55e';
      case 'CANCELADA': return '#ef4444';
      case 'FINALIZADA': return '#64748b';
      default: return '#3b82f6';
    }
  }
}