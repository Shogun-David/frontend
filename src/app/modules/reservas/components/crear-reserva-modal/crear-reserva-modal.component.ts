import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';
import { SalaModel } from '@core/models/sala.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SalasService } from '@modules/salas/service/salas.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-crear-reserva-modal',
  templateUrl: './crear-reserva-modal.component.html'
})
export class CrearReservaModalComponent implements OnInit {

  salas: SalaModel[] = [];
  loading = false;

  minDateTime!: string;
  minFechaFin!: string;

  form = this.fb.group(
    {
      idSala: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      observacion: ['']
    },
    {
      validators: this.fechaFinMayorQueInicio
    }
  );

  constructor(
    private fb: FormBuilder,
    private reservasService: ReservasService,
    private salasService: SalasService,
    public activeModal: NgbActiveModal,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.setMinDateTime();
    this.cargarSalas();
  }

  private setMinDateTime(): void {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 16);

    this.minDateTime = formatted;
    this.minFechaFin = formatted;
  }

  onFechaInicioChange(): void {
    const fechaInicio = this.form.get('fechaInicio')?.value;

    if (fechaInicio) {
      this.minFechaFin = fechaInicio;
      this.form.get('fechaFin')?.setValue('');
    }
  }

  cargarSalas(): void {
    this.salasService.obtenerSalasDisponibles()
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

  // =========================
  // VALIDADOR PERSONALIZADO
  // =========================
  private fechaFinMayorQueInicio(control: AbstractControl): ValidationErrors | null {
    const inicio = control.get('fechaInicio')?.value;
    const fin = control.get('fechaFin')?.value;

    if (!inicio || !fin) return null;

    return new Date(fin) > new Date(inicio)
      ? null
      : { fechaFinInvalida: true };
  }
}
