import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthService } from './services/auth.service';
import { AuthServiceMock } from './services/auth.service.mock';

// Cambiar a AuthService cuando tengas el backend Java
const useAuthServiceMock = false; // Cambiar a false para usar backend real

@NgModule({
  declarations: [
    AuthPageComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [
    {
      provide: AuthService,
      useClass: useAuthServiceMock ? AuthServiceMock : AuthService
    }
  ]
})
export class AuthModule { }


