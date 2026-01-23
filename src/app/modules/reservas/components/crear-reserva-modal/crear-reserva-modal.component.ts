import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import esLocale from '@fullcalendar/core/locales/es';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { ReservasService } from '../../services/reservas.service';
import { SalaModel } from '@core/models/sala.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@core/services/notification.service';
import { ReservaDisponibilidad } from '@core/models/reserva.disponibilidad';
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

  calendarOptions!: CalendarOptions;
  minFechaInicio!: string;

  reservasOcupadas: ReservaDisponibilidad[] = [];

  form = this.fb.group(
    {
      idSala: ['', Validators.required],
      fechaInicio: [null as string | null, Validators.required],
      fechaFin: [null as string | null, Validators.required],
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

    this.form.get('idSala')?.valueChanges.subscribe(salaId => {
      if (salaId) {
        this.initCalendar(Number(salaId));
      }
    });
  }

  private initCalendar(salaId: number): void {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      height: 350,
      contentHeight: 300,
      aspectRatio: 1.2,
      locale: esLocale,
      selectable: true,

      validRange: {
        start: hoy
      },

      showNonCurrentDates: false,
      fixedWeekCount: false,

      headerToolbar: {
        left: 'title',
        center: '',
        right: 'prev,next today'
      },

      datesSet: (info) => {
        const visibleDate = info.view.currentStart;
        const year = visibleDate.getFullYear();
        const month = visibleDate.getMonth() + 1;
        this.cargarDisponibilidad(salaId, year, month);
      },

      select: (info) => {
        this.onSelectRange(info);
      },

      events: []
    };
  }

  private cargarDisponibilidad(
    salaId: number,
    year: number,
    month: number
  ): void {
    this.reservasService
      .getDisponibilidadSala(salaId, year, month)
      .subscribe(reservas => {

        this.reservasOcupadas = reservas;

        const eventos = reservas.map(r => ({
          start: r.fechaInicio.split('T')[0],
          end: this.sumarUnDia(r.fechaFin.split('T')[0]),
          display: 'background',
          backgroundColor: '#dc3545'
        }));

        this.calendarOptions = {
          ...this.calendarOptions,
          events: eventos
        };
      });
  }

  private onSelectRange(info: any): void {
    const inicio = new Date(info.start);
    const fin = new Date(info.end); // fin es EXCLUSIVO en fullcalendar
    fin.setDate(fin.getDate() - 1); // hacerlo inclusivo

    const inicioISO = this.toLocalISOString(inicio);
    const finISO = this.toLocalISOString(fin);

    const conflicto = this.verificarConflicto(inicioISO, finISO);

    if (conflicto) {
      this.notification.warning('El rango seleccionado tiene días ocupados');
      this.form.patchValue({ fechaInicio: null, fechaFin: null });
      return;
    }

    this.form.patchValue({
      fechaInicio: inicioISO,
      fechaFin: finISO
    });
  }

  private verificarConflicto(inicioISO: string, finISO: string): boolean {
    const inicio = new Date(inicioISO);
    const fin = new Date(finISO);

    return this.reservasOcupadas.some(r => {
      const ini = new Date(r.fechaInicio);
      const finR = new Date(r.fechaFin);

      return (inicio <= finR) && (fin >= ini);
    });
  }

  private setMinFechaActual(): void {
    const now = new Date();
    const localISO = this.toLocalISOString(now);
    this.minFechaInicio = localISO;
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

  private sumarUnDia(fecha: string): string {
    const d = new Date(fecha);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

   cargarSalas(): void {
    const body: PaginationModel = {
      pageNumber: 0,          // 👈 OJO: backend usa base 0
      rowsPerPage: 8,
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
