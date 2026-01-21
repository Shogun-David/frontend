import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservasRoutingModule } from './reservas-routing.module';
import { ReservasPageComponent } from './pages/reservas-page/reservas-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarioReservasComponent } from './components/calendario-reservas/calendario-reservas.component';
import { CrearReservaModalComponent } from './components/crear-reserva-modal/crear-reserva-modal.component';


@NgModule({
  declarations: [
    ReservasPageComponent,
    CalendarioReservasComponent,
    CrearReservaModalComponent
  ],
  imports: [
    CommonModule,
    ReservasRoutingModule,
    FormsModule,
    FullCalendarModule,
    ReactiveFormsModule
  ]
})
export class ReservasModule { }
