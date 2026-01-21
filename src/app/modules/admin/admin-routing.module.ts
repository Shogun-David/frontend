import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminReservasComponent } from './pages/admin-reservas/admin-reservas.component';
import { AdminUsuariosComponent } from './pages/admin-usuarios/admin-usuarios.component';

const routes: Routes = [
  {
    path: 'reservas',
    component: AdminReservasComponent
  },
  {
    path: 'usuarios',
    component: AdminUsuariosComponent
  },
  {
    path: '',
    redirectTo: 'reservas',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
