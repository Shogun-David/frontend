import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservasPageComponent } from './pages/reservas-page/reservas-page.component';
import { CalendarioPageComponent } from './pages/calendario-page/calendario-page.component';

const routes: Routes = [
  {
    path: '',
    component: ReservasPageComponent
  },
  {
    path: 'calendario/user',
    component: CalendarioPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservasRoutingModule { }
