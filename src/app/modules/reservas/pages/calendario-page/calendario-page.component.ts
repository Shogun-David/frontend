import { Component, OnInit } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { ReservasService } from '@modules/reservas/services/reservas.service';

@Component({
  selector: 'app-calendario-page',
  templateUrl: './calendario-page.component.html',
  styleUrls: ['./calendario-page.component.css']
})
export class CalendarioPageComponent implements OnInit {

  eventos: EventInput[] = [];
  loading = false;

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.cargarCalendarioUsuario();
  }

  cargarCalendarioUsuario(): void {
    this.loading = true;

    this.reservasService.getReservasByUserForCalendar()
      .subscribe({
        next: res => {
          this.eventos = res.content.map((r: any) => ({
            id: r.idReserva,
            title: r.sala,
            start: r.fechaInicio,
            end: r.fechaFin,
            color: this.colorPorEstado(r.estado)
          }));
          this.loading = false;
        },
        error: () => this.loading = false
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
