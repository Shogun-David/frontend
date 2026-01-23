import { Component } from '@angular/core';
import { PaginationModel } from '@core/models/pagination.model';
import { Sala } from '@core/models/sala.model';
import { NotificationService } from '@core/services/notification.service';
import { SalaService } from '@modules/sala/services/sala.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '@shared/components/confirmar-modal/confirmar-modal.component';

@Component({
  selector: 'app-salas',
  templateUrl: './salas.component.html',
  styleUrls: ['./salas.component.css']
})
export class SalasComponent {

  paginationState = {
    pageNumber: 0,
    rowsPerPage: 5,
    sortColumn: 'nombre',
    sortDirection: 'ASC' as 'ASC' | 'DESC',
    selectedEstado: ''
  };

  salas: Sala[] = [];

  totalElements = 0;
  totalPages = 0;

  showModal = false;
  selectedSala?: Sala;

  constructor(
    private salaService: SalaService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadSalas();
  }

  openCreateModal(): void {
    this.selectedSala = undefined;
    this.showModal = true;
  }

  openEditModal(sala: Sala): void {
    this.selectedSala = sala;
    this.showModal = true;
  }


  onSalaSaved(): void {
    this.showModal = false;
    this.loadSalas();
  }

  loadSalas(): void {
    const pagination: PaginationModel = {
      pageNumber: this.paginationState.pageNumber,
      rowsPerPage: this.paginationState.rowsPerPage,
      filters: this.paginationState.selectedEstado
        ? [{ field: 'estado', value: this.paginationState.selectedEstado }]
        : [],
      sorts: [
        { colName: this.paginationState.sortColumn, direction: this.paginationState.sortDirection }
      ]
    };

    this.salaService.getSalasPagination(pagination)
      .subscribe(response => {
        this.salas = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.paginationState.pageNumber = response.number;
      });
  }

  cancelar(sala: Sala): void {

    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.title = 'Cambiar estado';
    modalRef.componentInstance.message =
      '¿Deseas cambiar el estado de la Sala?';
    modalRef.componentInstance.confirmText = 'Sí, cambiar';
    modalRef.componentInstance.cancelText = 'No';
    modalRef.componentInstance.confirmButtonClass = 'btn-danger';

    modalRef.closed.subscribe(confirmado => {
      if (confirmado) {
        this.salaService
          .toggleEstadoSala(sala.idSala)
          .subscribe(() => {
            this.notificationService.success('El estado de la sala ha cambiado exitosamente');
            this.loadSalas();
          });
      }
    });
  }


  onEstadoChange(event: Event): void {
    this.paginationState.selectedEstado = (event.target as HTMLSelectElement).value;
    this.paginationState.pageNumber = 0;
    this.loadSalas();
  }


  onPageChange(page: number): void {
    this.paginationState.pageNumber = page;
    this.loadSalas();
  }


  changeSort(column: string): void {
    if (this.paginationState.sortColumn === column) {
      this.paginationState.sortDirection = this.paginationState.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.paginationState.sortColumn = column;
      this.paginationState.sortDirection = 'ASC';
    }

    this.paginationState.pageNumber = 0;
    this.loadSalas();
  }
}
