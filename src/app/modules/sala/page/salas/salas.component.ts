import { Component } from '@angular/core';
import { PaginationModel } from '@core/models/pagination.model';
import { Sala } from '@core/models/sala.model';
import { SalaService } from '@modules/sala/services/sala.service';

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

  constructor(private salaService: SalaService) { }

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


  onEstadoChange(event: Event): void {
    this.paginationState.selectedEstado = (event.target as HTMLSelectElement).value;
    this.paginationState.pageNumber = 0;
    this.loadSalas();
  }


  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }

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
