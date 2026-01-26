import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css']
})
export class AuthPageComponent implements OnInit {

  formLogin!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.formLogin = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  sendLogin(): void {
    if (this.formLogin.invalid) {
      this.errorMessage = 'Completa los campos correctamente';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.formLogin.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        const token = response.token;
        //const isAdmin = response.roles.includes('ADMIN');
        //this.router.navigate(isAdmin ? ['/admin'] : ['/reservas']);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
        this.isLoading = false;
      }
    });
  }


  
}
