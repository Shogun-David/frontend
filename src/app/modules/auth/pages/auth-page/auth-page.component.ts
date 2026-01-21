import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-auth-page',
    templateUrl: './auth-page.component.html',
    styleUrls: ['./auth-page.component.css']
})

export class AuthPageComponent implements OnInit {

    formLogin: FormGroup = new FormGroup({});
    isLoading = false;
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        console.log('AuthPageComponent created');
    }

    ngOnInit(): void {
        this.formLogin = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)])
        });
    }

    sendLogin() {
        if (this.formLogin.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            this.authService.sendCredentials(
                this.formLogin.value.email, 
                this.formLogin.value.password
            ).subscribe({
                next: (response) => {
                    console.log('Login successful', response);
                    // Redirigir según el rol
                    const role = this.authService.getUserRole();
                    if (role === 'admin') {
                        this.router.navigate(['/admin']);
                    } else {
                        this.router.navigate(['/reservas']);
                    }
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Login failed', error);
                    this.errorMessage = 'Correo o contraseña incorrectos';
                    this.isLoading = false;
                }
            });
        }
        else {
            console.log('Form is invalid');
            this.errorMessage = 'Por favor completa todos los campos correctamente';
        }
    }
}
