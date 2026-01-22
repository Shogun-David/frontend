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

  formRegister: FormGroup = new FormGroup({});
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.formRegister = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100),
        this.validarEmailUsuario.bind(this)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmarPassword: new FormControl('', [
        Validators.required
      ])
    });
  }

  /**
   * Validador personalizado: Verifica que el email sea @usuario.com
   */
  validarEmailUsuario(control: FormControl): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }
    
    const email = control.value;
    if (email.endsWith('@usuario.com')) {
      return null;
    }
    
    return { 'emailInvalido': { value: email } };
  }

  /**
   * Valida que las contraseñas coincidan
   */
  get passwordsCoinciden(): boolean {
    const password = this.formRegister.get('password')?.value;
    const confirmar = this.formRegister.get('confirmarPassword')?.value;
    return password === confirmar;
  }

  /**
   * Registrar nuevo usuario
   */
  registrar(): void {
    if (!this.formRegister.valid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      return;
    }

    if (!this.passwordsCoinciden) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const usuarioData = {
      username: this.formRegister.get('username')?.value,
      email: this.formRegister.get('email')?.value,
      password: this.formRegister.get('password')?.value,
      rol: 'usuario'  // Siempre se crea con rol usuario
    };

    this.authService.registrar(usuarioData).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        this.successMessage = 'Registro exitoso. Redirigiendo al login...';
        this.isLoading = false;
        
        // Redirigir a login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error al registrar', error);
        this.errorMessage = error.error?.message || 'Error al registrar. Intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Ir a login
   */
  irALogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
