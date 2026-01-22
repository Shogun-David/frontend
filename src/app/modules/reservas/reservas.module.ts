import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservasRoutingModule } from './reservas-routing.module';
import { ReservasPageComponent } from './pages/reservas-page/reservas-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearReservaModalComponent } from './components/crear-reserva-modal/crear-reserva-modal.component';
import { SharedModule } from "@shared/shared.module";
import { CalendarioPageComponent } from './pages/calendario-page/calendario-page.component';


@NgModule({
  declarations: [
    ReservasPageComponent,
    CrearReservaModalComponent,
    CalendarioPageComponent
  ],
  imports: [
    CommonModule,
    ReservasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
]
})
export class ReservasModule { }
