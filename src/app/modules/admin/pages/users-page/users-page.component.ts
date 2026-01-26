import { Component, OnInit } from '@angular/core';
import { AdminService, UsuarioResponseDto } from '@modules/admin/services/admin.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {

  usuarios: UsuarioResponseDto[] = [];

  // pagination
  page = 1;
  size = 8;
  total = 0;

  // filtros
  filtroUsername = '';
  filtroEstado = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    const body = {
      pageNumber: this.page - 1,
      rowsPerPage: this.size,
      filters: this.construirFiltros(),
      sorts: [{ colName: 'idUsuario', direction: 'ASC' }]
    };

    this.adminService.getUsuariosPagination(body).subscribe({
      next: resp => {
        this.usuarios = resp.content;
        this.total = resp.totalElements;
      },
      error: err => console.error(err)
    });
  }

  construirFiltros() {
    const filters: any[] = [];

    if (this.filtroUsername.trim()) {
      filters.push({
        field: 'username',
        value: this.filtroUsername
      });
    }

    if (this.filtroEstado) {
      filters.push({
        field: 'estado',
        value: this.filtroEstado
      });
    }

    return filters;
  }

  cambiarPagina(p: number): void {
    this.page = p;
    this.cargarUsuarios();
  }

  deshabilitar(usuario: UsuarioResponseDto): void {
    if (usuario.estado === 'I') return;

    this.adminService.deshabilitarUsuario(usuario.idUsuario).subscribe({
      next: () => this.cargarUsuarios(),
      error: err => console.error(err)
    });
  }
}
