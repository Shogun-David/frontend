# Sistema de Autenticación con Mock

## Credenciales de Prueba

### Admin
- **Email:** `admin@example.com`
- **Contraseña:** `admin123`
- **Rol:** admin
- **Acceso:** Panel Admin, Listar Usuarios

### Usuario Regular
- **Email:** `usuario@example.com`
- **Contraseña:** `user123`
- **Rol:** usuario
- **Acceso:** Ver y crear reservas

### Admin Alternativo
- **Email:** `maria@example.com`
- **Contraseña:** `maria123`
- **Rol:** admin
- **Acceso:** Panel Admin, Listar Usuarios

## Archivos Creados/Modificados

### 1. **auth.service.mock.ts** (Nuevo)
- Mock del servicio de autenticación
- Contiene credenciales locales para testing
- Simula respuestas del backend
- Métodos:
  - `sendCredentials()` - Login
  - `getUserRole()` - Obtener rol
  - `getUserEmail()` - Obtener email
  - `isAdmin()` - Verificar si es admin
  - `logout()` - Cerrar sesión

### 2. **auth.module.ts** (Modificado)
- Agregado Provider con Dependency Injection
- `useAuthServiceMock = true` para usar el mock
- Cambia a `useAuthServiceMock = false` cuando tengas el backend Java
- Agregados módulos: `ReactiveFormsModule` y `RouterModule`

### 3. **auth-page.component.ts** (Modificado)
- Conectado al formulario (FormGroup)
- Método `sendLogin()` con validaciones
- Redirección según rol:
  - Admin → `/admin`
  - Usuario → `/reservas`
- Mensajes de error
- Loading state

### 4. **auth-page.component.html** (Modificado)
- Formulario reactivo con `formGroup` y `formControlName`
- Validaciones en tiempo real
- Mensajes de error dinámicos
- Información de credenciales de prueba
- Botón deshabilitado hasta llenar formulario

### 5. **auth-page.component.css** (Modificado)
- Nuevos estilos para mensajes de error
- Estilos para info de credenciales
- Estilos para button deshabilitado
- Mejorado feedback visual

## Flujo de Login

1. Usuario ingresa email y contraseña
2. El formulario valida en tiempo real
3. Al hacer submit, `AuthPageComponent` llama a `AuthService.sendCredentials()`
4. El Mock busca las credenciales en su array local
5. Si encuentra coincidencia:
   - Genera un token fake
   - Guarda el token en cookies
   - Guarda el rol en localStorage
   - Devuelve la respuesta con el usuario
6. El componente obtiene el rol y redirige:
   - Si rol === 'admin' → `/admin`
   - Si rol === 'usuario' → `/reservas`

## Cambiar a Backend Real

Cuando tengas el backend Java lista:

1. En `auth.module.ts`:
   ```typescript
   const useAuthServiceMock = false; // Cambiar a true
   ```

2. Actualiza `auth.service.ts` con la URL real del backend:
   ```typescript
   return this.httpClient.post<any>(`${this.URL}/auth/login`, body)
   ```

## Próximos Pasos

1. Crear `AdminGuard` para proteger rutas de admin
2. Crear `AdminPageComponent` y `UsuariosPageComponent`
3. Actualizar `app-routing.module.ts` con guards
4. Agregar logout en la navegación
