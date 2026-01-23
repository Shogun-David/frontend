import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [
      {
        path: '',
        redirectTo: 'reservas',
        pathMatch: 'full'
      },
      {
        path: 'reservas',
        canActivate: [authGuard],
        loadChildren: () =>
          import('../reservas/reservas.module').then(m => m.ReservasModule)
      },
      {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { role: 'ADMIN' },
        loadChildren: () =>
          import('../admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'salas',
        loadChildren: () =>
          import('../sala/sala.module').then(m => m.SalaModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
