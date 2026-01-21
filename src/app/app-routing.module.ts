import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@core/guards/admin.guard';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => 
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'home',
    loadChildren: () => 
      import('./modules/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reservas',
    loadChildren: () => 
      import('./modules/reservas/reservas.module').then(m => m.ReservasModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () => 
      import('./modules/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
