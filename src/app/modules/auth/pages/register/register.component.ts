import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formRegister!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.formRegister = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(9)
      ]),
      confirmarPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(9)
      ])
    });
  }

  get passwordsCoinciden(): boolean {
    const password = this.formRegister.get('password')?.value;
    const confirmar = this.formRegister.get('confirmarPassword')?.value;
    return password === confirmar;
  }

  registrar(): void {
    if (this.formRegister.invalid) {
      this.errorMessage = 'Completa correctamente el formulario';
      return;
    }

    if (!this.passwordsCoinciden) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request = {
      username: this.formRegister.value.username,
      password: this.formRegister.value.password
    };

    this.authService.registrar(request).subscribe({
      next: () => {
        this.successMessage = 'Usuario registrado correctamente';
        this.isLoading = false;

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message || 'Error al registrar usuario';
        this.isLoading = false;
      }
    });
  }

  irALogin(): void {
    this.router.navigate(['/auth']);
  }
}
