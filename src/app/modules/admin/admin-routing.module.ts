import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { CalendarioAdminPageComponent } from './pages/calendario-admin-page/calendario-admin-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent
  },
  {
    path: 'reservas/calendario',
    component: CalendarioAdminPageComponent
  },
  {
    path: 'usuarios',
    component: UsersPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
