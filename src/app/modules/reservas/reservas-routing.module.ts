import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservasPageComponent } from './pages/reservas-page/reservas-page.component';
import { CalendarioPageComponent } from './pages/calendario-page/calendario-page.component';
import { authGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        component: ReservasPageComponent
      },
      {
        path: 'calendario',
        component: CalendarioPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservasRoutingModule { }
