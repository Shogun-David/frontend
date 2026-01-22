import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { CalendarioAdminPageComponent } from './pages/calendario-admin-page/calendario-admin-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent
  },
  {
    path: 'reservas/calendario',
    component: CalendarioAdminPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
