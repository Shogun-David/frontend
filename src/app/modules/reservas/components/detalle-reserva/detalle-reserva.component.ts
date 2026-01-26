import { Component, Input, OnInit } from '@angular/core';
import { ReservasService } from '../../services/reservas.service';
import { ReservaModel } from '@core/models/reserva.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.component.html'
})
export class DetalleReservaComponent implements OnInit {

  @Input() idReserva!: number;

  reserva?: ReservaModel;
  loading = true;

  constructor(
    private reservasService: ReservasService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.cargarDetalle();
  }

  cargarDetalle(): void {
    this.reservasService.getReservaById(this.idReserva).subscribe({
      next: res => {
        this.reserva = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
