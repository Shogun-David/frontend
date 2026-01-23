import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { CalendarioAdminPageComponent } from './pages/calendario-admin-page/calendario-admin-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { UsersPageComponent } from './pages/users-page/users-page.component';


@NgModule({
  declarations: [
    CalendarioAdminPageComponent,
    AdminPageComponent,
    UsersPageComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class AdminModule { }
