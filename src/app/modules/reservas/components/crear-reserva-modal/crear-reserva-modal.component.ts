import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';

@Component({
  selector: 'app-crear-reserva-modal',
  templateUrl: './crear-reserva-modal.component.html'
})
export class CrearReservaModalComponent {

  @Output() created = new EventEmitter<void>();

  form = this.fb.group({
    idSala: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    observacion: ['']
  });

  constructor(
    private fb: FormBuilder,
    private reservasService: ReservasService
  ) {}

  guardar(): void {
    if (this.form.invalid) return;

    this.reservasService.create(this.form.value)
      .subscribe(() => {
        this.created.emit();
        (window as any).bootstrap.Modal
          .getInstance(document.getElementById('crearReservaModal'))
          ?.hide();
      });
  }
}
