import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalaRoutingModule } from './sala-routing.module';
import { SalasComponent } from './page/salas/salas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormSalaComponent } from './components/form-sala/form-sala.component';
import { PaginationComponent } from './components/pagination/pagination.component';


@NgModule({
  declarations: [
    SalasComponent,
    FormSalaComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    SalaRoutingModule,
    ReactiveFormsModule
  ]
})
export class SalaModule { }
