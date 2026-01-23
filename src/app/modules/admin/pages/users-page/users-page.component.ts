import { Component, OnInit } from '@angular/core';
import { AdminService, UsuarioResponseDto } from '@modules/admin/services/admin.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {

  usuarios: UsuarioResponseDto[] = [];
  filtro: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.adminService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error(err)
    });
  }

  buscarUsuario(): UsuarioResponseDto[] {
    if (!this.filtro.trim()) return this.usuarios;
    const f = this.filtro.toLowerCase();
    return this.usuarios.filter(u =>
      u.username.toLowerCase().includes(f) ||
      u.email.toLowerCase().includes(f) ||
      u.estado.toLowerCase().includes(f)
    );
  }
}
