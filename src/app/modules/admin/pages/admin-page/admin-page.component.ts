import { Component, OnInit } from '@angular/core';
import { ReservasService } from '@modules/reservas/services/reservas.service';
import { ReservaListadoAdminModel } from '@core/models/reserva-listado-admin.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '@shared/components/confirmar-modal/confirmar-modal.component';
import { NotificationService } from '@core/services/notification.service';
import { PaginationModel } from '@core/models/pagination.model';
import { DetalleReservaComponent } from '@modules/reservas/components/detalle-reserva/detalle-reserva.component';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  reservas: ReservaListadoAdminModel[] = [];

  // filtros
  estadoFiltro: string = '';
  salaFiltro: string = '';
  usuarioFiltro: string = '';

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

    if (this.usuarioFiltro) {
      this.pagination.filters.push({
        field: 'usuario',
        value: this.usuarioFiltro
      });
    }

    this.reservasService
      .getReservaListadoAdmin(this.pagination)
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

  limpiarFiltros(): void {
    this.estadoFiltro = '';
    this.salaFiltro = '';
    this.usuarioFiltro = '';
    this.filtrar();
  }

  cambiarPagina(p: number): void {
    this.page = p;
    this.cargarReservas();
  }

  verDetalle(idReserva: number): void {
      const modalRef = this.modalService.open(DetalleReservaComponent, {
        size: 'lg',
        centered: true,
        backdrop: 'static'
      });
  
      modalRef.componentInstance.idReserva = idReserva;
    }

  cancelar(reserva: ReservaListadoAdminModel): void {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.title = 'Cancelar reserva';
    modalRef.componentInstance.message =
      '¿Está seguro que desea cancelar esta reserva? Esta acción no se puede deshacer.';
    modalRef.componentInstance.confirmText = 'Sí, cancelar';
    modalRef.componentInstance.cancelText = 'No';
    modalRef.componentInstance.confirmButtonClass = 'btn-danger';

    modalRef.closed.subscribe(confirmado => {
      if (confirmado) {
        this.reservasService
          .cancelarReserva(reserva.idReserva, 'Cancelación por administrador')
          .subscribe(() => {
            this.notificationService.success('Reserva cancelada por administrador');
            this.cargarReservas();
          });
      }
    });
  }
}
