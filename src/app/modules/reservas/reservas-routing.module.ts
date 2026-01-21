import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservasPageComponent } from './pages/reservas-page/reservas-page.component';

const routes: Routes = [
  {
    path: '',
    component: ReservasPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservasRoutingModule { }
