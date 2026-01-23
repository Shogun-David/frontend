import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';
import { Sala } from '@core/models/sala.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@core/services/notification.service';
import { SalaService } from '@modules/sala/services/sala.service';
import { PaginationModel } from '@core/models/pagination.model';

@Component({
  selector: 'app-crear-reserva-modal',
  templateUrl: './crear-reserva-modal.component.html'
})
export class CrearReservaModalComponent implements OnInit {

  salas: Sala[] = [];
  loading = false;

  form = this.fb.group({
    idSala: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    observacion: ['']
  });

  constructor(
    private fb: FormBuilder,
    private reservasService: ReservasService,
    private salasService: SalaService,
    public activeModal: NgbActiveModal,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.cargarSalas();
  }

  cargarSalas(): void {
    const body: PaginationModel = {
      pageNumber: 0,          // 👈 OJO: backend usa base 0
      rowsPerPage: 5,
      filters: [
        { field: 'estado', value: 'D' }
      ],
      sorts: []
    };
    this.salasService.getSalasPagination(body)
      .subscribe({
        next: res => this.salas = res.content
      });
  }

  guardar(): void {
    if (this.form.invalid) return;

    this.loading = true;

    this.reservasService.create(this.form.value)
      .subscribe({
        next: () => {
          this.notification.success('Reserva creada correctamente');
          this.activeModal.close(true);
        },
        error: () => this.loading = false
      });
  }

  cancelar(): void {
    this.activeModal.dismiss();
  }
}
