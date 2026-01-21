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
              redirectTo: 'home',
              pathMatch: 'full'
          },
          {
              path: 'reservas',
              loadChildren: () =>
                  import('../reservas/reservas.module').then(m => m.ReservasModule)
          }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
