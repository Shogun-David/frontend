import { Component, OnInit } from '@angular/core';
import { ReservasService, Reserva } from '../../services/reservas.service';
import { UsuariosService, Usuario } from '../../services/usuarios.service';

@Component({
  selector: 'app-admin-reservas',
  templateUrl: './admin-reservas.component.html',
  styleUrls: ['./admin-reservas.component.css']
})
export class AdminReservasComponent implements OnInit {

  // Reservas
  reservas: Reserva[] = [];
  isLoadingReservas = false;
  
  // Usuarios
  usuarios: Usuario[] = [];
  isLoadingUsuarios = false;
  
  // General
  errorMessage = '';
  successMessage = '';
  activeTab = 'reservas'; // 'reservas' o 'usuarios'
  
  // Filtros
  filtroUsuario = '';
  filtroSala = '';
  filtroFecha = '';

  constructor(
    private reservasService: ReservasService,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    this.cargarReservas();
    this.cargarUsuarios();
  }

  /**
   * Cargar lista de reservas del servidor
   */
  private cargarReservas(): void {
    this.isLoadingReservas = true;
    this.reservasService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.isLoadingReservas = false;
        console.log('Reservas cargadas:', this.reservas);
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.errorMessage = 'Error al cargar las reservas';
        this.isLoadingReservas = false;
      }
    });
  }

  /**
   * Cargar lista de usuarios del servidor
   */
  private cargarUsuarios(): void {
    this.isLoadingUsuarios = true;
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoadingUsuarios = false;
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.errorMessage = 'Error al cargar los usuarios';
        this.isLoadingUsuarios = false;
      }
    });
  }

  /**
   * Cancelar reserva
   */
  cancelarReserva(reserva: Reserva): void {
    if (reserva.id && confirm(`¿Cancelar reserva de ${reserva.usuario} en ${reserva.sala}?`)) {
      this.reservasService.cancelarReserva(reserva.id).subscribe({
        next: () => {
          this.successMessage = `Reserva cancelada correctamente`;
          this.cargarReservas();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error al cancelar reserva:', error);
          this.errorMessage = 'Error al cancelar la reserva';
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
   * Obtener reservas filtradas
   */
  get reservasFiltradas(): Reserva[] {
    return this.reservas.filter(r => {
      const usuarioMatch = !this.filtroUsuario || r.usuario.toLowerCase().includes(this.filtroUsuario.toLowerCase());
      const salaMatch = !this.filtroSala || r.sala.toLowerCase().includes(this.filtroSala.toLowerCase());
      const fechaMatch = !this.filtroFecha || r.fecha === this.filtroFecha;
      return usuarioMatch && salaMatch && fechaMatch;
    });
  }

  /**
   * Limpiar filtros
   */
  limpiarFiltros(): void {
    this.filtroUsuario = '';
    this.filtroSala = '';
    this.filtroFecha = '';
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

