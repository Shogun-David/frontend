import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SlideBarComponent } from './components/slide-bar/slide-bar.component';
import { CalendarioReservasComponent } from './components/calendario-reservas/calendario-reservas.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from './components/confirmar-modal/confirmar-modal.component';
import { ToastComponent } from './components/toast/toast.component';
import { PaginationComponent } from './components/pagination/pagination.component';


@NgModule({
  declarations: [
    SlideBarComponent,
    CalendarioReservasComponent,
    ConfirmModalComponent,
    ToastComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FullCalendarModule,
    FormsModule
  ], exports: [
    SlideBarComponent,
    CalendarioReservasComponent,
    ConfirmModalComponent,
    ToastComponent,
    PaginationComponent
  ]
})
export class SharedModule { }
