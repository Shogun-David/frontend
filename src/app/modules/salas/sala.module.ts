import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalasRoutingModule } from './sala-routing.module';
import { PaginationSalaComponent } from './components/pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalasComponent } from './page/salas/salas.component';
import { FormSalaComponent } from './components/form-sala/form-sala.component';
import { SharedModule } from "@shared/shared.module";


@NgModule({
  declarations: [
    PaginationSalaComponent,
    SalasComponent,
    FormSalaComponent
  ],
  imports: [
    CommonModule,
    SalasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
]
})
export class SalasModule { }
