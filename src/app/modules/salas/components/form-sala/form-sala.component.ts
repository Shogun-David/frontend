import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalaModel } from '@core/models/sala.model';
import { SalaService } from '@modules/salas/service/salas.service';

@Component({
  selector: 'app-form-sala',
  templateUrl: './form-sala.component.html',
  styleUrls: ['./form-sala.component.css']
})
export class FormSalaComponent implements OnInit {

  @Input() sala?: SalaModel;
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  form!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private salaService: SalaService
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.sala;

    this.form = this.fb.group({
      nombre: [this.sala?.nombre ?? '', Validators.required],
      capacidad: [this.sala?.capacidad ?? null, Validators.required],
      ubicacion: [this.sala?.ubicacion ?? '', Validators.required],
      estado: ['A']
    });

    if (this.isEditMode) {
      this.form.removeControl('estado');
    }
  }

  save(): void {
  if (this.form.invalid) return;

  if (this.isEditMode && this.sala) {
    const payload: SalaModel = this.form.value;

    this.salaService
      .updateSala(this.sala.idSala, payload)
      .subscribe(() => {
        this.saved.emit();
        this.close();
      });

  } else {
    const payload: SalaModel = this.form.value;

    this.salaService
      .createSala(payload)
      .subscribe(() => {
        this.saved.emit();
        this.close();
      });
  }
}


  close(): void {
    this.closed.emit();
  }
}
