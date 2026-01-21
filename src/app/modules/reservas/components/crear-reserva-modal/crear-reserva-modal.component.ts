import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crear-reserva-modal',
  templateUrl: './crear-reserva-modal.component.html'
})
export class CrearReservaModalComponent {

  form = this.fb.group({
    idSala: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    observacion: ['']
  });

  loading = false;

  constructor(
    private fb: FormBuilder,
    private reservasService: ReservasService,
    public activeModal: NgbActiveModal
  ) {}

  guardar(): void {
    if (this.form.invalid) return;

    this.loading = true;

    this.reservasService.create(this.form.value)
      .subscribe({
        next: () => {
          this.activeModal.close(true); // ← notifica éxito
        },
        error: () => this.loading = false
      });
  }

  cancelar(): void {
    this.activeModal.dismiss();
  }
}
