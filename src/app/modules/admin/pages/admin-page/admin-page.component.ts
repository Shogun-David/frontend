import { Component, OnInit } from '@angular/core';
import { ReservasService } from '@modules/reservas/services/reservas.service';
import { ReservaModel } from '@core/models/reserva.model';
import { EventInput } from '@fullcalendar/core';
import { ReservaAdminModel } from '@core/models/reserva.admin.model';
import { ConfirmModalComponent } from '@shared/components/confirmar-modal/confirmar-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@core/services/notification.service';

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
  size = 8;
  total = 0;
  loading = false;

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
              .cancelarReserva(reserva.idReserva, 'Cancelación desde UI')
              .subscribe(() => {
                this.notificationService.success('Reserva cancelada por administrador');
                this.cargarReservas();
              });
          }
      });
  }


}
