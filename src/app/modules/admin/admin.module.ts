import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminReservasComponent } from './pages/admin-reservas/admin-reservas.component';
import { AdminUsuariosComponent } from './pages/admin-usuarios/admin-usuarios.component';


@NgModule({
  declarations: [
    AdminReservasComponent,
    AdminUsuariosComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
