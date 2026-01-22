import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalaRoutingModule } from './sala-routing.module';
import { SalasComponent } from './page/salas/salas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormSalaComponent } from './components/form-sala/form-sala.component';


@NgModule({
  declarations: [
    SalasComponent,
    FormSalaComponent
  ],
  imports: [
    CommonModule,
    SalaRoutingModule,
    ReactiveFormsModule
  ]
})
export class SalaModule { }
