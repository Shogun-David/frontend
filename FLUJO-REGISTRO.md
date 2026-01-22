# Sistema de Registro e Identificación de Usuario

## Flujo Completo

### 1. **Registro de Usuario Público** (/auth/register)

```
Usuario accede a /auth/register
    ↓
Completa formulario:
  • username (3-50 caracteres)
  • email (debe ser @usuario.com)
  • password (mín 8 caracteres)
  • confirmar password
    ↓
Frontend valida:
  ✓ Email termina con @usuario.com
  ✓ Contraseñas coinciden
  ✓ Campos requeridos
    ↓
Envía POST /api/auth/register con:
  {
    "username": "juan.perez",
    "email": "juan.perez@usuario.com",
    "password": "pass1234",
    "rol": "usuario"
  }
    ↓
Backend:
  ✓ Valida email @usuario.com
  ✓ Verifica que username sea único
  ✓ Crea usuario con rol = "usuario"
  ✓ Guarda en BD USUARIO
  ✓ Retorna success
    ↓
Frontend:
  ✓ Muestra "Registro exitoso"
  ✓ Redirige a /auth/login después de 1.5s
    ↓
Usuario inicia sesión con:
  • email: juan.perez@usuario.com
  • password: pass1234
    ↓
Backend valida y devuelve:
  {
    "token": "eyJhbGc...",
    "user": {
      "email": "juan.perez@usuario.com",
      "rol": "usuario"
    }
  }
    ↓
Frontend guarda:
  • Token en cookies
  • Rol en localStorage (usuario)
  • Email en localStorage (juan.perez@usuario.com)
    ↓
Redirige a /reservas
    ↓
Sidebar muestra:
  👤 juan.perez@usuario.com [USUARIO]
```

## Validaciones en el Frontend

### Formulario de Registro

```typescript
// register.component.ts

validarEmailUsuario(control: FormControl) {
  if (!control.value) return null;
  
  const email = control.value;
  if (email.endsWith('@usuario.com')) {
    return null;  // ✓ Válido
  }
  
  return { 'emailInvalido': { value: email } };  // ✗ Error
}
```

### Mensajes de Error

- ❌ "El nombre de usuario es requerido"
- ❌ "Mínimo 3 caracteres"
- ❌ "Máximo 50 caracteres"
- ❌ "El email es requerido"
- ❌ "Ingresa un email válido"
- ❌ "El email debe ser @usuario.com" ← **VALIDACIÓN ESPECIAL**
- ❌ "La contraseña es requerida"
- ❌ "Mínimo 8 caracteres"
- ❌ "Las contraseñas no coinciden"

## Identificación del Usuario en la App

### Ubicación: Sidebar (Derecha inferior)

```
┌─────────────────────────┐
│ 📋 Reservas             │
├─────────────────────────┤
│ ✓ Mis Reservas          │
│ ✓ Crear Reserva         │
│ ✓ Calendario            │
│                         │
├─────────────────────────┤
│ 👤 juan.perez@usuario   │
│    [USUARIO]            │  ← Identificación
│                         │
│ [ Cerrar sesión ]       │
└─────────────────────────┘
```

### Lo que se Muestra

```typescript
// slide-bar.component.html

<div *ngIf="userEmail" class="user-info mb-3">
  <div class="user-badge">
    <i class="bi bi-person-circle"></i>
    {{ userEmail }}
    <span *ngIf="isAdmin" class="badge bg-warning">ADMIN</span>
    <span *ngIf="!isAdmin" class="badge bg-info">USUARIO</span>
  </div>
</div>
```

### Lo que Controla

```typescript
// slide-bar.component.ts

isAdmin: boolean;       // true si rol === "admin"
userEmail: string;      // email del usuario

ngOnInit() {
  this.isAdmin = this.authService.isAdmin();
  this.userEmail = this.authService.getUserEmail();
}

logout() {
  this.authService.logout();
  // Redirigir a login (agregar cuando sea necesario)
}
```

## Archivos Modificados/Creados

### ✅ Creados

| Archivo | Descripción |
|---------|-------------|
| `register.component.ts` | Componente de registro con validaciones |
| `register.component.html` | Plantilla del formulario |
| `register.component.css` | Estilos consistentes |

### ✅ Modificados

| Archivo | Cambio |
|---------|--------|
| `auth.service.ts` | Agregado método `registrar()` |
| `auth.service.mock.ts` | Agregado método `registrar()` con validación @usuario.com |
| `auth-routing.module.ts` | Agregada ruta `/register` |
| `auth.module.ts` | Declarado `RegisterComponent` |
| `slide-bar.component.html` | Mejorada identificación del usuario |
| `slide-bar.component.css` | Agregados estilos para user-info |

## Rutas Disponibles

```
/auth/login       → Iniciar sesión
/auth/register    → Registrarse (PÚBLICO)
/reservas         → Mis reservas (requiere autenticación)
/admin/usuarios   → Gestión de usuarios (solo admin)
```

## Mock de Usuario para Pruebas

Si usas `useAuthServiceMock = true`, puedes:

1. **Registrarte** con cualquier email @usuario.com:
   - usuario: `test`
   - email: `test@usuario.com`
   - password: `password123`

2. **Luego loguearte** con esas credenciales

3. **Ver tu identificación** en el sidebar

## Cambiar a Backend Real

En `auth.module.ts`:

```typescript
// De:
const useAuthServiceMock = true;

// A:
const useAuthServiceMock = false;
```

Y asegúrate que tu backend Java tenga estos endpoints:

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/usuarios` - Listar usuarios
