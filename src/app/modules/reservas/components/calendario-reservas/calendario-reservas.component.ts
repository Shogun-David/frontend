import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ReservasService } from '../../services/reservas.service';

@Component({
  selector: 'app-calendario-reservas',
  templateUrl: './calendario-reservas.component.html',
  styleUrls: ['./calendario-reservas.component.css']
})
export class CalendarioReservasComponent implements OnInit {

  calendarOptions!: CalendarOptions;

  userId = 1;

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    // TODO: Descomentar cuando el backend tenga implementado GET /api/reservas/by-user/{id}
    // this.cargarCalendario();
  }

  cargarCalendario(): void {
    this.reservasService.getReservasCalendario(this.userId)
      .subscribe(res => {

        const eventos = res.content.map((r: any) => ({
          id: r.idReserva,
          title: `${r.sala}`,
          start: r.fechaInicio,
          end: r.fechaFin,
          color: this.colorPorEstado(r.estado)
        }));

        this.calendarOptions = {
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
          initialView: 'dayGridMonth',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
          events: eventos
        };
      });
  }

  private colorPorEstado(estado: string): string {
    switch (estado) {
      case 'ACTIVA': return '#22c55e';      // verde
      case 'CANCELADA': return '#ef4444';   // rojo
      case 'FINALIZADA': return '#64748b';  // gris
      default: return '#3b82f6';
    }
  }
}
