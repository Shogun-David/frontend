# Spring Boot Backend Integration - Complete

## 🔗 Integration Summary

El frontend Angular ha sido completamente configurado para conectarse al backend Spring Boot en `http://localhost:8080`.

## 📝 Cambios Realizados

### 1. **environments.ts**
- **Cambio**: URL actualizada de `http://localhost:8080/api/1.0` a `http://localhost:8080`
- **Razón**: Simplificar la base URL y que cada endpoint sea responsable de su ruta

### 2. **auth.service.ts - Método `sendCredentials()` (Login)**
- **Cambios**:
  - Endpoint: `POST /auth/login` (sin cambios)
  - Body: `{ username, password }` (cambió de `email` a `username`)
  - Respuesta esperada: `{ token: "eyJhbGc..." }`
  - Token extraction: Busca `data.token` directamente (antes intentaba múltiples formatos)
  - JWT Parsing: Decodifica el JWT para extraer el role
  - Token storage: Guarda en cookies Y localStorage para redundancia
  
**Código**:
```typescript
sendCredentials(email: string, password: string) : Observable<any> {
  const body = {
    username: email,  // Enviar como username al backend
    password
  };

  return this.httpClient.post<any>(`${this.URL}/auth/login`, body).pipe(
    tap((data) => {
      const token = data.token;  // Spring retorna { token: "..." }
      if (token) {
        this.cookieService.set('token', token, 4, '/');
        localStorage.setItem('token', token);
        
        // Extraer role del JWT payload
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const role = payload.role || 'usuario';
          localStorage.setItem('userRole', role);
          localStorage.setItem('userEmail', email);
        } catch (e) {
          localStorage.setItem('userRole', 'usuario');
          localStorage.setItem('userEmail', email);
        }
      }
    })
  );
}
```

### 3. **auth.service.ts - Método `registrar()` (Registro)**
- **Cambios**:
  - Endpoint: `POST /api/usuarios` (cambió de `/auth/register`)
  - Body: `{ username, email, password, roles: ['USUARIO'] }`
  - Roles como array (Spring requiere formato array, no string)
  
**Código**:
```typescript
registrar(usuarioData: any): Observable<any> {
  const body = {
    username: usuarioData.username,
    email: usuarioData.email,
    password: usuarioData.password,
    roles: ['USUARIO']  // Spring Backend espera roles como array
  };

  return this.httpClient.post<any>(`${this.URL}/api/usuarios`, body).pipe(
    tap((data) => {
      console.log('User registered successfully', data);
    })
  );
}
```

### 4. **auth.service.ts - Método `isAdmin()`**
- **Cambio**: Ahora valida ambos formatos de role ('admin' y 'ADMIN')
```typescript
isAdmin(): boolean {
  const role = this.getUserRole();
  return role === 'admin' || role === 'ADMIN';
}
```

### 5. **auth-page.component.ts - Login Component**
- **Cambio**: Redirección que soporta ambos formatos de role
```typescript
next: (response) => {
  const role = this.authService.getUserRole();
  if (role === 'admin' || role === 'ADMIN') {
    this.router.navigate(['/admin']);
  } else {
    this.router.navigate(['/reservas']);
  }
}
```

### 6. **inject-session.interceptor.ts - HTTP Interceptor**
- **Cambio**: Ahora verifica localStorage si no hay token en cookies
```typescript
intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  let token = this.cookieService.get('token');
  
  // Fallback a localStorage si no hay en cookies
  if (!token) {
    token = localStorage.getItem('token') || '';
  }

  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next.handle(request);
}
```

## 🔐 Flujo de Autenticación

### Login (POST /auth/login)
```
1. Usuario ingresa email + password
2. Frontend envía { username, password } a /auth/login
3. Backend valida y retorna { token: "eyJhbGciOi..." }
4. Frontend:
   - Guarda token en cookies y localStorage
   - Decodifica JWT para extraer role
   - Guarda role y email en localStorage
   - Redirige a /admin (si admin) o /reservas (si usuario)
```

### Registro (POST /api/usuarios)
```
1. Usuario completa formulario con username, email (@usuario.com), password
2. Frontend valida:
   - Email debe terminar en @usuario.com
   - Password confirmación coincide
3. Frontend envía { username, email, password, roles: ['USUARIO'] }
4. Backend:
   - Encripta password con BCrypt
   - Crea usuario con rol USUARIO
   - Retorna usuario creado
5. Frontend redirige a /auth/login para iniciar sesión
```

### Protected Requests (Cualquier otra API)
```
1. Frontend hace petición HTTP (GET, POST, etc.)
2. Interceptor agrega: Authorization: Bearer {token}
3. Backend valida token y procesa solicitud
4. Si token inválido: backend retorna 401
5. Frontend recibe error y debe redirigir a login
```

## 🧪 Pruebas

### Con Mock (Desarrollo Local Sin Backend)
1. En `auth.module.ts` cambiar: `useAuthServiceMock = true`
2. Usuarios de prueba:
   - Admin: `admin@example.com` / `password123`
   - Usuario: `usuario@example.com` / `password123`
   - Usuario 2: `maria@example.com` / `password123`

### Con Spring Boot Backend
1. En `auth.module.ts` cambiar: `useAuthServiceMock = false`
2. Backend debe estar corriendo en `http://localhost:8080`
3. Probar endpoints:
   - **Registro**: POST http://localhost:8080/api/usuarios
   - **Login**: POST http://localhost:8080/auth/login
   - **Verificar protección**: Usar token en Authorization header

## 🚀 Inicio Rápido

### 1. Asegurar que el Backend Spring Boot está corriendo
```bash
# En proyecto backend
mvn spring-boot:run
# Debe estar disponible en http://localhost:8080
```

### 2. Iniciar el Frontend Angular
```bash
npm start
# Abre http://localhost:4200
```

### 3. Probar Login
- Email: cualquier usuario registrado en el backend
- Password: contraseña del usuario
- Debe redirigir a /reservas o /admin según rol

### 4. Probar Registro (en otra pestaña)
- Username: nombre único (ej: nuevo_usuario)
- Email: DEBE terminar en @usuario.com
- Password: mínimo 8 caracteres
- Confirmar Password: debe coincidir
- Clic en Registrar → Redirige a Login

## 📊 Token JWT

El token retornado por Spring Boot es un JWT con estructura:
```
Header.Payload.Signature
```

**Payload decodificado (ejemplo)**:
```json
{
  "sub": "usuario@example.com",
  "role": "ADMIN",
  "iat": 1677000000,
  "exp": 1677003600
}
```

Frontend decodifica automáticamente para extraer `role` (línea 14 en auth.service.ts).

## 🔗 Endpoints Backend Esperados

| Método | Endpoint | Body | Respuesta |
|--------|----------|------|----------|
| POST | /api/usuarios | `{username, email, password, roles: ["USUARIO"]}` | Usuario creado |
| POST | /auth/login | `{username, password}` | `{token: "eyJ..."}` |
| GET | /api/usuarios | (Header: Authorization) | Lista de usuarios |
| GET | /api/salas | (Header: Authorization) | Lista de salas |
| GET | /api/reservas | (Header: Authorization) | Lista de reservas |

## ⚙️ Configuración CORS

El backend debe tener CORS habilitado para `http://localhost:4200`:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:4200")
                    .allowedMethods("*")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

## ✅ Checklist de Integración

- [x] URLs apuntando a http://localhost:8080
- [x] Endpoints actualizados (/auth/login, /api/usuarios)
- [x] Formatos de request ajustados (username, roles array)
- [x] Respuesta esperada: { token: "..." }
- [x] JWT decodificación para extraer role
- [x] Token en cookies + localStorage
- [x] Interceptor agrega Authorization header
- [x] isAdmin() soporta mayúsculas
- [x] Redirección según role funciona
- [x] Registro con validación @usuario.com

## 🐛 Debugging

### Ver qué se envía/recibe
1. Abrir DevTools (F12)
2. Ir a Network tab
3. Intentar login/registro
4. Ver request y response en Headers/Preview
5. Consola mostrará logs: "Sending credentials", "Response data:", etc.

### Token inválido o no se guarda
- Verificar en Storage tab que 'token' existe en localStorage
- Verificar en Application > Cookies que 'token' existe
- Ver console.log para mensajes de error

### 401 Unauthorized en siguientes requests
- Token expiró (exp en JWT)
- Backend no reconoce el token
- Authorization header no se envía (revisar interceptor)

## 📞 Soporte

Si el backend retorna errores:
- **400 Bad Request**: Revisar formato del body enviado
- **401 Unauthorized**: Token inválido o expirado
- **403 Forbidden**: Usuario no tiene permisos (rol)
- **500 Server Error**: Error en el backend
