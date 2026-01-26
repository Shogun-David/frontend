import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { ReservasService } from '../../services/reservas.service';
import { SalaModel } from '@core/models/sala.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@core/services/notification.service';
import { PaginationModel } from '@core/models/pagination.model';
import { SalaService } from '@modules/salas/service/salas.service';

@Component({
  selector: 'app-crear-reserva-modal',
  templateUrl: './crear-reserva-modal.component.html',
  styleUrls: ['./crear-reserva-modal.component.css']
})
export class CrearReservaModalComponent implements OnInit {

  salas: SalaModel[] = [];
  loading = false;

  minFechaInicio!: string;
  minFechaFin!: string;

  form = this.fb.group(
    {
      idSala: ['', Validators.required],
      fechaInicio: [null as string | null, Validators.required],
      fechaFin: [null as string | null, Validators.required],
      numeroAsistentes: [ null, [ Validators.required, Validators.min(1)]],
      observacion: ['']
    },
    { validators: this.fechaFinMayorQueInicio }
  );

  constructor(
    private fb: FormBuilder,
    private reservasService: ReservasService,
    private salasService: SalaService,
    public activeModal: NgbActiveModal,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.setMinFechaActual();
    this.cargarSalas();

    // 👉 cuando cambia fechaInicio, actualiza el mínimo de fechaFin
    this.form.get('fechaInicio')?.valueChanges.subscribe(fechaInicio => {
      if (fechaInicio) {
        this.minFechaFin = fechaInicio;

        const fechaFinCtrl = this.form.get('fechaFin');
        if (fechaFinCtrl?.value && fechaFinCtrl.value < fechaInicio) {
          fechaFinCtrl.setValue(null);
        }
      }
    });
  }

  private setMinFechaActual(): void {
    const now = new Date();
    this.minFechaInicio = this.toLocalISOString(now);
    this.minFechaFin = this.minFechaInicio;
  }

  private toLocalISOString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      date.getFullYear() + '-' +
      pad(date.getMonth() + 1) + '-' +
      pad(date.getDate()) + 'T' +
      pad(date.getHours()) + ':' +
      pad(date.getMinutes())
    );
  }

  cargarSalas(): void {
    const body: PaginationModel = {
      pageNumber: 0,
      rowsPerPage: 8,
      filters: [
        { field: 'estado', value: 'A' }
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

  private fechaFinMayorQueInicio(
    control: AbstractControl
  ): ValidationErrors | null {
    const inicio = control.get('fechaInicio')?.value;
    const fin = control.get('fechaFin')?.value;

    if (!inicio || !fin) return null;

    return new Date(fin) > new Date(inicio)
      ? null
      : { fechaFinInvalida: true };
  }
}
