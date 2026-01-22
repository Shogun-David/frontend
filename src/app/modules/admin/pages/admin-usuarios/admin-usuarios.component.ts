import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService, Usuario } from '../../services/usuarios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  formUsuario: FormGroup = new FormGroup({});
  isLoading = false;
  showForm = false;
  modoEdicion = false;
  usuarioEditandoId: number | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(
    private usuariosService: UsuariosService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.inicializarFormulario();
  }

  /**
   * Cargar lista de usuarios del servidor
   */
  private cargarUsuarios(): void {
    this.isLoading = true;
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading = false;
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.errorMessage = 'Error al cargar los usuarios';
        this.isLoading = false;
      }
    });
  }

  /**
   * Inicializar formulario reactivo
   */
  private inicializarFormulario(): void {
    this.formUsuario = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roles: [['USUARIO'], Validators.required]
    });
  }

  /**
   * Mostrar formulario para nuevo usuario
   */
  mostrarNuevoUsuario(): void {
    this.modoEdicion = false;
    this.usuarioEditandoId = null;
    this.formUsuario.reset({ roles: ['USUARIO'] });
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Guardar usuario (crear o actualizar)
   */
  guardarUsuario(): void {
    if (this.formUsuario.valid) {
      this.isLoading = true;
      const usuarioData = this.formUsuario.value;

      if (this.modoEdicion && this.usuarioEditandoId) {
        // Actualizar usuario existente
        this.usuariosService.actualizarUsuario(this.usuarioEditandoId, usuarioData).subscribe({
          next: () => {
            this.successMessage = 'Usuario actualizado correctamente';
            this.showForm = false;
            this.cargarUsuarios();
            this.isLoading = false;
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error al actualizar usuario:', error);
            this.errorMessage = error.error?.message || 'Error al actualizar usuario';
            this.isLoading = false;
          }
        });
      } else {
        // Crear nuevo usuario
        this.usuariosService.crearUsuario(usuarioData).subscribe({
          next: () => {
            this.successMessage = 'Usuario creado correctamente';
            this.showForm = false;
            this.cargarUsuarios();
            this.isLoading = false;
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error al crear usuario:', error);
            this.errorMessage = error.error?.message || 'Error al crear usuario';
            this.isLoading = false;
          }
        });
      }
    }
  }

  /**
   * Cargar datos para editar usuario
   */
  editarUsuario(usuario: Usuario): void {
    this.modoEdicion = true;
    this.usuarioEditandoId = usuario.id || null;
    this.formUsuario.patchValue({
      username: usuario.username,
      email: usuario.email,
      roles: usuario.roles
    });
    // No mostrar password en edición
    this.formUsuario.get('password')?.clearValidators();
    this.formUsuario.get('password')?.updateValueAndValidity();
    this.showForm = true;
    this.errorMessage = '';
  }

  /**
   * Cancelar operación
   */
  cancelar(): void {
    this.showForm = false;
    this.modoEdicion = false;
    this.usuarioEditandoId = null;
    this.formUsuario.reset();
    this.errorMessage = '';
  }

  /**
   * Cambiar rol de usuario
   */
  cambiarRol(usuario: Usuario): void {
    const nuevoRol = usuario.roles.includes('ADMIN') ? ['USUARIO'] : ['ADMIN'];
    
    if (usuario.id && confirm(`¿Cambiar rol a ${nuevoRol[0]}?`)) {
      this.usuariosService.cambiarRol(usuario.id, nuevoRol).subscribe({
        next: () => {
          this.successMessage = `Rol de ${usuario.username} actualizado a ${nuevoRol[0]}`;
          this.cargarUsuarios();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error al cambiar rol:', error);
          this.errorMessage = 'Error al cambiar el rol';
        }
      });
    }
  }

  /**
   * Eliminar usuario
   */
  eliminarUsuario(usuario: Usuario): void {
    if (usuario.id && confirm(`¿Eliminar usuario ${usuario.username}?`)) {
      this.usuariosService.eliminarUsuario(usuario.id).subscribe({
        next: () => {
          this.successMessage = `Usuario ${usuario.username} eliminado`;
          this.cargarUsuarios();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          this.errorMessage = 'Error al eliminar el usuario';
        }
      });
    }
  }

  /**
   * Obtener color de badge según rol
   */
  getRolBadgeClass(rol: string): string {
    return rol === 'ADMIN' ? 'badge-danger' : 'badge-info';
  }

  /**
   * Obtener etiqueta de rol
   */
  getRolLabel(rol: string): string {
    return rol === 'ADMIN' ? 'Administrador' : 'Usuario Regular';
  }
}
