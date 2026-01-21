# Validación con Tokens - Documentación

## Componentes Creados/Modificados

### 1. **admin.guard.ts** (Nuevo)
Protege rutas que solo admins pueden acceder.

**Ubicación:** `/src/app/core/guards/admin.guard.ts`

**Función:**
- Verifica si `authService.isAdmin()` es true
- Si es admin → permite acceso
- Si no es admin → redirige a `/auth/login`

**Uso en rutas:**
```typescript
{
  path: 'admin',
  canActivate: [AdminGuard],
  loadChildren: () => import('./modules/admin/admin.module')
}
```

---

### 2. **auth.guard.ts** (Nuevo)
Protege rutas que requieren estar autenticado.

**Ubicación:** `/src/app/core/guards/auth.guard.ts`

**Función:**
- Verifica si existe un token en cookies
- Si existe token → permite acceso
- Si no existe token → redirige a `/auth/login`

**Uso en rutas:**
```typescript
{
  path: 'reservas',
  canActivate: [AuthGuard],
  loadChildren: () => import('./modules/reservas/reservas.module')
}
```

---

### 3. **app-routing.module.ts** (Modificado)
Ahora protege las rutas con guards.

**Rutas protegidas:**
- `/home` → Requiere `AuthGuard` (cualquier usuario autenticado)
- `/reservas` → Requiere `AuthGuard`
- `/admin` → Requiere `AdminGuard` (solo admins)
- `/` → Redirige a `/home`
- `/**` (rutas inexistentes) → Redirige a `/auth/login`

---

### 4. **inject-session.interceptor.ts** (Mejorado)
Intercepta todas las peticiones HTTP y adjunta el token.

**Ubicación:** `/src/app/core/interceptors/inject-session.interceptor.ts`

**Función:**
1. Obtiene el token de las cookies
2. Si existe token → lo adjunta al header `Authorization: Bearer {token}`
3. Envía la petición con el token
4. El backend valida el token

---

## Flujo Completo de Validación

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUARIO INICIA SESIÓN (auth-page.component)             │
│    • Ingresa email: admin@example.com                       │
│    • Ingresa password: admin123                             │
│    • Click en "Iniciar Sesión"                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. AUTH SERVICE VALIDA (auth.service o auth.service.mock)  │
│    • sendCredentials() busca las credenciales               │
│    • Si Mock → valida localmente                            │
│    • Si Real → envía HTTP POST al backend                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. BACKEND RESPONDE                                         │
│    {                                                        │
│      "token": "eyJhbGc...",                                │
│      "user": {                                              │
│        "email": "admin@example.com",                        │
│        "rol": "admin"                                       │
│      }                                                      │
│    }                                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. AUTH SERVICE GUARDA DATOS                                │
│    • Token en cookies: cookieService.set('token', ...)     │
│    • Rol en localStorage: localStorage.setItem('userRole')│
│    • Email en localStorage: localStorage.setItem('userEmail')│
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. COMPONENTE REDIRIGE SEGÚN ROL                           │
│    • Si admin → router.navigate(['/admin'])                │
│    • Si usuario → router.navigate(['/reservas'])           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. GUARD VERIFICA ACCESO A RUTA                            │
│                                                              │
│    Para /admin:                                             │
│    ✓ AdminGuard → isAdmin() → true → PERMITIDO             │
│                                                              │
│    Para /reservas:                                          │
│    ✓ AuthGuard → existe token → true → PERMITIDO           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. CADA REQUEST HTTP INCLUYE TOKEN                         │
│                                                              │
│    Cuando hace: reservasService.getReservas()              │
│                                                              │
│    Interceptor automáticamente:                             │
│    • Obtiene token de cookies                               │
│    • Adjunta en header:                                     │
│      Authorization: Bearer eyJhbGc...                       │
│                                                              │
│    GET /api/reservas HTTP/1.1                              │
│    Authorization: Bearer eyJhbGc...                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. BACKEND VALIDA TOKEN                                    │
│                                                              │
│    @GetMapping("/reservas")                                │
│    public ResponseEntity<?> getReservas(                   │
│      @RequestHeader("Authorization") String token          │
│    ) {                                                      │
│      String userId = validarToken(token);                  │
│      if (userId == null) {                                 │
│        return ResponseEntity.status(401)                   │
│          .body("Token inválido");                          │
│      }                                                      │
│      // Permite acceso                                     │
│    }                                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. RESPUESTA AL FRONTEND                                   │
│    • Si token válido → 200 OK + datos                      │
│    • Si token inválido → 401 Unauthorized                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. MANEJO DE ERRORES 401                                  │
│     (Opcional: agregar interceptor para 401)               │
│                                                              │
│     Si recibe 401 → Token expirado                         │
│     → Limpiar cookies/localStorage                         │
│     → Redirigir a /auth/login                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujo Detallado - Ejemplo Práctico

### Caso 1: Admin accede a `/admin/usuarios`

```
1. Admin hace login con admin@example.com
2. Backend devuelve token con rol "admin"
3. AuthService guarda: userRole = "admin"
4. Redirige a /admin
5. AdminGuard.canActivate():
   - Llama authService.isAdmin()
   - Verifica localStorage.getItem('userRole') === 'admin'
   - Devuelve true → ACCESO PERMITIDO
6. Componente carga → HTTP GET /api/admin/usuarios
7. Interceptor adjunta:
   Authorization: Bearer eyJhbGc...
8. Backend valida token → Devuelve lista de usuarios
```

### Caso 2: Usuario normal intenta acceder a `/admin/usuarios`

```
1. Usuario hace login con usuario@example.com
2. Backend devuelve token con rol "usuario"
3. AuthService guarda: userRole = "usuario"
4. Redirige a /reservas
5. Si intenta ir a /admin manualmente
6. AdminGuard.canActivate():
   - Llama authService.isAdmin()
   - Verifica localStorage.getItem('userRole') === 'usuario'
   - Devuelve false
   - router.navigate(['/auth/login'])
   - ❌ ACCESO DENEGADO → Redirige a login
```

### Caso 3: Usuario sin autenticación intenta acceder a `/reservas`

```
1. Abre navegador e ingresa directamente /reservas
2. AuthGuard.canActivate():
   - Busca token en cookies
   - cookieService.get('token') → null/vacío
   - Devuelve false
   - router.navigate(['/auth/login'])
   - ❌ ACCESO DENEGADO → Redirige a login
```

---

## Resumen de Archivos

| Archivo | Función | Ubicación |
|---------|---------|-----------|
| **admin.guard.ts** | Protege rutas de admin | `/core/guards/` |
| **auth.guard.ts** | Protege rutas autenticadas | `/core/guards/` |
| **app-routing.module.ts** | Define rutas con guards | `/app/` |
| **inject-session.interceptor.ts** | Adjunta token a requests | `/core/interceptors/` |
| **auth.service.ts** | Maneja credenciales | `/modules/auth/services/` |
| **auth.service.mock.ts** | Mock para testing | `/modules/auth/services/` |

---

## Próximos Pasos

1. **Crear módulo admin** con componentes:
   - AdminReservasComponent
   - AdminUsuariosComponent

2. **Agregar manejo de errores 401** en un nuevo interceptor

3. **Implementar refresh token** (opcional, para tokens que expiran)

4. **Validar en backend** que el token sea válido en cada endpoint
