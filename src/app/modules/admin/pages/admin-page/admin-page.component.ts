import { Component, OnInit } from '@angular/core';
import { ReservasService } from '@modules/reservas/services/reservas.service';
import { ReservaModel } from '@core/models/reserva.model';
import { EventInput } from '@fullcalendar/core';
import { ReservaAdminModel } from '@core/models/reserva.admin.model';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  reservas: ReservaAdminModel[] = [];
  eventos: EventInput[] = [];

  estadoFiltro = '';
  page = 1;
  size = 10;
  total = 0;
  loading = false;

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.loading = true;

    this.reservasService
      .getReservationsAdmin(this.estadoFiltro, this.page, this.size)
      .subscribe({
        next: res => {
          this.reservas = res.content;
          this.total = res.totalElements;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  filtrar(): void {
    this.page = 1;
    this.cargarReservas();
  }

  cambiarPagina(p: number): void {
    this.page = p;
    this.cargarReservas();
  }

  cancelar(reserva: ReservaModel): void {
    // luego aquí usarás tu modal de confirmación
    if (!confirm('¿Cancelar esta reserva?')) return;

    this.reservasService
      .cancelarReserva(reserva.idReserva, 'Cancelado por administrador')
      .subscribe(() => {
        this.cargarReservas();
      });
  }


}
