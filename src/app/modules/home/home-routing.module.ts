import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';

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
        loadChildren: () =>
          import('../reservas/reservas.module').then(m => m.ReservasModule)
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
