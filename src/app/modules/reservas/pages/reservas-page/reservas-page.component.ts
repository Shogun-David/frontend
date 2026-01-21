import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../../services/reservas.service';
import { ReservaModel } from '@core/models/reserva.model';

@Component({
  selector: 'app-reservas-page',
  templateUrl: './reservas-page.component.html'
})
export class ReservasPageComponent implements OnInit {

  reservas: ReservaModel[] = [];
  estadoFiltro: string = '';
  page = 1;
  size = 10;
  total = 0;
  loading = false;

  // 🔴 luego lo obtendrás del JWT
  userId = 1;

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    
    console.log('cargar reservas');
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.loading = true;

    this.reservasService
      .getByUser(this.userId, this.estadoFiltro, this.page, this.size)
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

  cancelar(reserva: ReservaModel): void {
    if (!confirm('¿Desea cancelar la reserva?')) return;

    this.reservasService
      .cancelarReserva(reserva.idReserva, 'Cancelación desde UI')
      .subscribe(() => this.cargarReservas());
  }

  cambiarPagina(p: number): void {
    this.page = p;
    this.cargarReservas();
  }
}
