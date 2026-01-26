import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../../services/reservas.service';
import { ReservaModel } from '@core/models/reserva.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrearReservaModalComponent } from '@modules/reservas/components/crear-reserva-modal/crear-reserva-modal.component';
import { ConfirmModalComponent } from '@shared/components/confirmar-modal/confirmar-modal.component';
import { NotificationService } from '@core/services/notification.service';
import { PaginationModel } from '@core/models/pagination.model';
import { DetalleReservaComponent } from '@modules/reservas/components/detalle-reserva/detalle-reserva.component';

@Component({
  selector: 'app-reservas-page',
  templateUrl: './reservas-page.component.html'
})
export class ReservasPageComponent implements OnInit {

  reservas: ReservaModel[] = [];

  // filtros
  estadoFiltro: string = '';
  salaFiltro: string = '';

  // paginación
  page = 1;
  size = 8;
  total = 0;
  loading = false;

  pagination: PaginationModel = {
    pageNumber: 0,
    rowsPerPage: 8,
    filters: [],
    sorts: []
  };

  constructor(
    private reservasService: ReservasService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.loading = true;

    this.pagination.pageNumber = this.page - 1;
    this.pagination.rowsPerPage = this.size;
    this.pagination.filters = [];

    if (this.estadoFiltro) {
      this.pagination.filters.push({
        field: 'estado',
        value: this.estadoFiltro
      });
    }

    if (this.salaFiltro) {
      this.pagination.filters.push({
        field: 'sala',
        value: this.salaFiltro
      });
    }

    this.reservasService
      .getByUser(this.pagination)
      .subscribe({
        next: res => {
          this.reservas = res.content;
          this.total = res.totalElements;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  verDetalle(idReserva: number): void {
    const modalRef = this.modalService.open(DetalleReservaComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.idReserva = idReserva;
  }

  filtrar(): void {
    this.page = 1;
    this.cargarReservas();
  }

  limpiarFiltros(): void {
    this.estadoFiltro = '';
    this.salaFiltro = '';
    this.filtrar();
  }

  cambiarPagina(p: number): void {
    this.page = p;
    this.cargarReservas();
  }

  abrirCrearReserva(): void {
    const modalRef = this.modalService.open(CrearReservaModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.closed.subscribe(() => {
      this.cargarReservas();
    });
  }

  cancelar(reserva: ReservaModel): void {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.title = 'Cancelar reserva';
    modalRef.componentInstance.message =
      '¿Está seguro que desea cancelar esta reserva?';
    modalRef.componentInstance.confirmText = 'Sí, cancelar';
    modalRef.componentInstance.cancelText = 'No';
    modalRef.componentInstance.confirmButtonClass = 'btn-danger';

    modalRef.closed.subscribe(confirmado => {
      if (confirmado) {
        this.reservasService
          .cancelarReserva(reserva.idReserva, 'Cancelación desde UI')
          .subscribe(() => {
            this.notificationService.success('Reserva cancelada');
            this.cargarReservas();
          });
      }
    });
  }
}
