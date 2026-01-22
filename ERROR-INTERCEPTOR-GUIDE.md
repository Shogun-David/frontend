# Error Interceptor - Manejo de Errores HTTP

## 🚨 ¿Qué es el Error Interceptor?

Un interceptor que captura automáticamente errores HTTP (401, 403, etc.) y toma acciones sin que necesites manejo manual en cada componente.

## 📁 Archivo

**Ubicación**: `src/app/core/interceptors/error.interceptor.ts`

## 🎯 Funcionalidades

### 401 Unauthorized - Token Expirado o Inválido

**Cuándo ocurre**:
- Token expiró (tiempo vencido)
- Token fue revocado en el backend
- Token está malformado

**Qué hace el interceptor**:
1. Detecta status 401
2. Registra en console: "Token inválido o expirado"
3. Llama `authService.logout()`:
   - Limpia localStorage
   - Limpia cookies
   - Limpia rol y email
4. Redirige a `/auth/login`
5. Muestra alerta: "Tu sesión ha expirado"

**Ejemplo en consola**:
```
HTTP Error: 401 Unauthorized
Token inválido o expirado. Sesión cerrada.
```

### 403 Forbidden - Permisos Insuficientes

**Cuándo ocurre**:
- Usuario intenta acceder a ruta /admin sin ser admin
- Usuario no tiene rol requerido para una operación
- Token válido pero sin permisos necesarios

**Qué hace el interceptor**:
1. Detecta status 403
2. Registra en console: "Acceso denegado"
3. Redirige a `/home` (página de inicio)
4. Muestra alerta: "No tienes permisos"

**Ejemplo en consola**:
```
HTTP Error: 403 Forbidden
Acceso denegado: Permisos insuficientes
```

## 🔄 Flujo Automático

```
Usuario hace petición HTTP
        ↓
InjectSessionInterceptor agrega token
        ↓
Backend procesa
        ↓
¿Respuesta exitosa?
  ├─ Sí (200, 201, etc) → Componente recibe datos ✅
  └─ No → ErrorInterceptor captura
        ↓
¿Es 401 Unauthorized?
  ├─ Sí → logout() + redirect /auth/login + alert ❌
  └─ No → ¿Es 403 Forbidden?
        ├─ Sí → redirect /home + alert ❌
        └─ No → Propagar error a componente
```

## 📋 Casos de Uso

### Caso 1: Token Expira Durante Sesión

```typescript
// Usuario hace clic en "Mis Reservas"
this.httpClient.get('/api/reservas').subscribe({
  next: (data) => {
    // Nunca llega aquí si token está expirado
  },
  error: (error) => {
    // ErrorInterceptor ya lo manejó
    // No necesitas código aquí
  }
});

// Si token expiró:
// 1. Backend retorna 401
// 2. ErrorInterceptor lo captura
// 3. logout() automático
// 4. Redirect a /auth/login automático
// 5. Alerta "Tu sesión ha expirado"
// ✅ Usuario ve login, no error confuso
```

### Caso 2: Usuario Regular Intenta Acceder a /admin

```typescript
// Si la ruta no está protegida por AdminGuard:
this.httpClient.get('/admin/usuarios').subscribe({
  next: (data) => {
    // Nunca llega aquí sin permiso ADMIN
  }
});

// Si backend retorna 403:
// 1. ErrorInterceptor lo captura
// 2. Redirect a /home
// 3. Alerta "No tienes permisos"
// ✅ Usuario redirigido correctamente
```

### Caso 3: Petición Normal sin Errores

```typescript
this.httpClient.get('/api/salas').subscribe({
  next: (data) => {
    // Trabajas como siempre
    this.salas = data;
  },
  error: (error) => {
    // Si no es 401 o 403, el error llega aquí
    // Puedes manejarlo en el componente si quieres
  }
});
```

## 🔧 Configuración

### Archivo: app.module.ts

```typescript
providers: [
  CookieService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: InjectSessionInterceptor,  // Añade token
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,          // Maneja errores
    multi: true
  }
]
```

**Orden importante**: 
1. Primero `InjectSessionInterceptor` (agrega token)
2. Luego `ErrorInterceptor` (maneja respuestas)

## 📝 Código Completo del Interceptor

```typescript
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error.status, error.message);

        // 401 Unauthorized
        if (error.status === 401) {
          console.warn('Token inválido o expirado. Sesión cerrada.');
          this.authService.logout();
          this.router.navigate(['/auth/login']);
          alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        }

        // 403 Forbidden
        if (error.status === 403) {
          console.warn('Acceso denegado: Permisos insuficientes');
          this.router.navigate(['/home']);
          alert('No tienes permisos para acceder a este recurso.');
        }

        return throwError(() => error);
      })
    );
  }
}
```

## 🧪 Testing

### Test 1: Token Expirado

**Escenario**:
1. Login correctamente
2. Esperar a que el token expire (o manualmente cambiar el token en localStorage a valor inválido)
3. Hacer clic en una ruta protegida
4. API retornará 401

**Resultado esperado**:
- ✅ Console muestra "HTTP Error: 401"
- ✅ Alerta: "Tu sesión ha expirado"
- ✅ Redirige a /auth/login
- ✅ localStorage está vacío (logout ejecutado)

### Test 2: Token Modificado

**Escenario**:
1. Login correctamente
2. Abrir DevTools → Storage → localStorage
3. Cambiar valor de "token" (agregar caracteres aleatorios al final)
4. Hacer clic en /reservas

**Resultado esperado**:
- ✅ Backend rechaza token inválido (401)
- ✅ Interceptor captura
- ✅ logout() ejecutado
- ✅ Redirect a login

### Test 3: Acceso Denegado

**Escenario**:
1. Login como usuario regular (USUARIO, no ADMIN)
2. Intentar GET /admin/usuarios manualmente
3. Backend retorna 403

**Resultado esperado**:
- ✅ Console muestra "HTTP Error: 403"
- ✅ Alerta: "No tienes permisos"
- ✅ Redirige a /home

## 💡 Mejoras Futuras

### 1. Mostrar Toast en lugar de Alert

```typescript
// Cambiar de alert() a toastr o ngx-toastr
// Para mejor UX sin interrumpir la navegación
if (error.status === 401) {
  this.toastr.error('Tu sesión ha expirado', 'Sesión Expirada');
}
```

### 2. Reintentar Petición Automáticamente

```typescript
// Si el error es 401, reintentar después de refrescar token
// Requiere refresh token implementado en backend
if (error.status === 401) {
  return this.authService.refreshToken().pipe(
    switchMap(() => next.handle(request)),
    catchError(() => this.handleSessionExpired())
  );
}
```

### 3. Logging Centralizado

```typescript
// Enviar errores a un servicio de logging
private logError(status: number, message: string) {
  this.loggingService.logError({
    timestamp: new Date(),
    status,
    message,
    url: request.url
  });
}
```

### 4. Manejo de 5xx Errores

```typescript
if (error.status >= 500) {
  console.error('Error del servidor');
  this.toastr.error('Error del servidor. Intenta más tarde', 'Error');
}
```

## 📊 Matriz de Errores Manejados

| Status | Nombre | Acción |
|--------|--------|--------|
| 401 | Unauthorized | logout() + redirect /auth/login + alert |
| 403 | Forbidden | redirect /home + alert |
| Otros | - | Propagar a componente |

## 🔐 Seguridad

✅ **Qué protege**:
- Si token es robado/interceptado, se invalida automáticamente
- Al expirar, fuerza nuevo login
- Permisos se validan en frontend Y backend

⚠️ **No reemplaza**:
- Validación de permisos en backend (SIEMPRE hacer en backend)
- HTTPS en producción
- Almacenamiento seguro de tokens

## ❌ Errores Comunes

### Error: "Infinite Redirect Loop"

**Causa**: Si logout() o redirect disparan otra petición que retorna 401

**Solución**: Excluir rutas de login/logout del interceptor

```typescript
if (request.url.includes('/auth/login')) {
  return next.handle(request);
}
```

### Error: No se ejecuta ErrorInterceptor

**Causa**: No está registrado en app.module.ts

**Solución**: Verificar providers en app.module.ts tiene ErrorInterceptor

### Error: Redirige pero se vuelve a hacer la petición

**Causa**: El componente está reintentando automáticamente

**Solución**: Cancelar subscripción en ngOnDestroy

```typescript
ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

## ✅ Checklist

- [x] ErrorInterceptor creado en /core/interceptors/
- [x] Maneja 401 Unauthorized (logout + redirect + alert)
- [x] Maneja 403 Forbidden (redirect + alert)
- [x] Registrado en app.module.ts
- [x] InjectSessionInterceptor se ejecuta primero
- [x] ErrorInterceptor se ejecuta después
- [x] No hay errores de compilación
- [x] Tested manualmente

---

**Status**: ✅ IMPLEMENTADO Y LISTO
