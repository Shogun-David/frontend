import { Component } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { ReservasService } from '@modules/reservas/services/reservas.service';

@Component({
  selector: 'app-calendario-admin-page',
  templateUrl: './calendario-admin-page.component.html',
  styleUrls: ['./calendario-admin-page.component.css']
})
export class CalendarioAdminPageComponent {

    eventos: EventInput[] = [];
    loading = false;
  
    // 🔴 luego vendrá del JWT
    userId = 1;
  
    constructor(private reservasService: ReservasService) {}
  
    ngOnInit(): void {
      this.cargarCalendarioAdmin();
    }
  
    cargarCalendarioAdmin(): void {
      this.loading = true;
      /*
      this.reservasService.getReservationsAdmin()
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
    */
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
