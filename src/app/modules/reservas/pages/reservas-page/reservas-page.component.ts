import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../../services/reservas.service';
import { ReservaModel } from '@core/models/reserva.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrearReservaModalComponent } from '@modules/reservas/components/crear-reserva-modal/crear-reserva-modal.component';
import { ConfirmModalComponent } from '@shared/components/confirmar-modal/confirmar-modal.component';
import { NotificationService } from '@core/services/notification.service';

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

  eventos: EventInit[] = [];

  constructor(
    private reservasService: ReservasService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) {}

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
      '¿Está seguro que desea cancelar esta reserva? Esta acción no se puede deshacer.';
    modalRef.componentInstance.confirmText = 'Sí, cancelar';
    modalRef.componentInstance.cancelText = 'No';
    modalRef.componentInstance.confirmButtonClass = 'btn-danger';

    modalRef.closed.subscribe(confirmado => {
      if (confirmado) {
        this.reservasService
          .cancelarReserva(reserva.idReserva, 'Cancelación desde UI')
          .subscribe(() => {
            this.notificationService.success('Reserva cancelada exitosamente');
            this.cargarReservas();
          });
      }
    });
  }

 
}
