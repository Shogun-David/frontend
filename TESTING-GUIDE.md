# Testing Spring Boot Integration

## 🧪 Test Workflow

### Paso 1: Verificar que el Backend está corriendo

```bash
# En terminal del backend
mvn spring-boot:run
# O desde IDE: Run button

# Verificar que esté disponible
curl http://localhost:8080/api/usuarios
# Debe retornar datos (puede ser 401 si no hay token)
```

### Paso 2: Iniciar Frontend Angular

```bash
cd frontend
npm start
# Abre http://localhost:4200
# Verá página de login
```

### Paso 3: Prueba 1 - Registro

**Escenario**: Crear nuevo usuario

1. Clic en "Crear Cuenta" en página de login
2. Completa formulario:
   - Username: `nuevo_usuario` (o nombre único)
   - Email: `nuevo_usuario@usuario.com` ✅ (IMPORTANTE: debe terminar en @usuario.com)
   - Password: `Segura123!` (mín 8 caracteres)
   - Confirmar: `Segura123!`
3. Clic "Registrar"
4. **Resultado esperado**: 
   - ✅ Si email NO termina en @usuario.com → Error: "Email debe ser @usuario.com"
   - ✅ Si email correcto → Redirige a login
   - ✅ En console debe ver: "Registering user { username, email, password, roles: ['USUARIO'] }"
   - ✅ En Network tab → POST /api/usuarios → Response 200/201

### Paso 4: Prueba 2 - Login

**Escenario**: Iniciar sesión con usuario registrado

1. Email: `nuevo_usuario@usuario.com`
2. Password: `Segura123!`
3. Clic "Iniciar Sesión"
4. **Resultado esperado**:
   - ✅ En console: "Sending credentials { username: '...', password: '...' }"
   - ✅ En Network → POST /auth/login → Response: `{ token: "eyJ..." }`
   - ✅ En Storage → localStorage → Debe existir "token" y "userRole"
   - ✅ Redirige a /reservas (usuario regular)
   - ✅ Sidebar muestra email + badge "USUARIO"

### Paso 5: Prueba 3 - Admin Login (si existe usuario admin)

**Escenario**: Iniciar sesión como admin

1. Email: `admin@ejemplo.com` (ajustar a usuario admin real)
2. Password: contraseña del admin
3. Clic "Iniciar Sesión"
4. **Resultado esperado**:
   - ✅ Redirige a /admin (no a /reservas)
   - ✅ Sidebar muestra menú admin
   - ✅ Badge muestra "ADMIN"
   - ✅ Puede ver /admin/reservas y /admin/usuarios

### Paso 6: Prueba 4 - Token Persistence

**Escenario**: Verificar que el token se mantiene

1. Iniciar sesión (como en Paso 4)
2. Abrir DevTools → Storage → localStorage
3. **Resultado esperado**:
   - ✅ Clave "token" existe con valor JWT
   - ✅ Clave "userRole" existe ("USUARIO" o "ADMIN")
   - ✅ Clave "userEmail" existe

### Paso 7: Prueba 5 - Protected Route

**Escenario**: Acceder a ruta protegida

1. Iniciar sesión exitosamente
2. Hacer clic en "Mis Reservas" o ruta protegida
3. **Resultado esperado**:
   - ✅ Puede acceder (tiene token)
   - ✅ En Network → GET /api/reservas → Request Headers incluye "Authorization: Bearer ..."
   - ✅ Recibe datos del servidor

### Paso 8: Prueba 6 - Logout

**Escenario**: Cerrar sesión

1. Ir a sidebar (click en hamburguesa)
2. Clic "Logout"
3. **Resultado esperado**:
   - ✅ Redirige a /auth/login
   - ✅ localStorage está vacío (no hay "token", "userRole", "userEmail")
   - ✅ Cookies están vacías
   - ✅ En console: "User logged out"

### Paso 9: Prueba 7 - Access Denied

**Escenario**: Usuario regular intenta acceder a /admin

1. Iniciar sesión como usuario regular
2. Acceder manualmente a `http://localhost:4200/admin`
3. **Resultado esperado**:
   - ✅ AdminGuard bloquea acceso
   - ✅ Redirige a /auth/login
   - ✅ En console: "No tienes permisos" o similar

### Paso 10: Prueba 8 - Invalid Credentials

**Escenario**: Intentar login con datos inválidos

1. Email: `usuario@usuario.com`
2. Password: `contraseña_incorrecta`
3. Clic "Iniciar Sesión"
4. **Resultado esperado**:
   - ✅ En Network → POST /auth/login → Response 401/403
   - ✅ En UI aparece: "Correo o contraseña incorrectos"
   - ✅ NO redirige, se mantiene en login
   - ✅ localStorage está vacío

## 🔍 Debug Checklist

### Si login NO funciona:
- [ ] ¿Backend está corriendo en http://localhost:8080?
- [ ] ¿CORS está habilitado en backend?
- [ ] ¿El usuario existe en BD del backend?
- [ ] ¿La contraseña es correcta?
- [ ] DevTools Network → ver request/response de POST /auth/login
- [ ] DevTools Console → ver logs de "Sending credentials" y "Response data"

### Si token NO se guarda:
- [ ] ¿Response /auth/login tiene campo "token"?
- [ ] ¿O es "accessToken" o "tokenSession"?
- [ ] Ajustar línea 30 en auth.service.ts si es otro nombre
- [ ] DevTools Storage → verificar localStorage

### Si Authorization header NO se envía:
- [ ] ¿Verificar interceptor en inject-session.interceptor.ts?
- [ ] ¿Token existe en localStorage/cookies?
- [ ] DevTools Network → Headers → ver "Authorization: Bearer ..."
- [ ] Si no está → interceptor no se ejecuta

### Si redireccionamiento es incorrecto:
- [ ] ¿El JWT contiene "role" field?
- [ ] ¿O es "roles" array?
- [ ] Decodificar JWT manualmente en jwt.io
- [ ] Ajustar parsing en auth.service.ts línea 32-38

## 📋 Casos de Prueba Manual

### Test Case 1: Happy Path Registration
```
Given: Página /auth/register abierta
When: 
  - Username: "juan_test"
  - Email: "juan_test@usuario.com"
  - Password: "Password123!"
  - Confirmar: "Password123!"
  - Click Registrar
Then:
  - POST /api/usuarios retorna 201
  - Redirige a /auth/login
  - Muestra mensaje de éxito (opcional)
```

### Test Case 2: Invalid Email Format
```
Given: Página /auth/register abierta
When:
  - Email: "juan_test@gmail.com" (NO es @usuario.com)
Then:
  - Botón Registrar está DISABLED
  - Muestra error: "Email debe ser @usuario.com"
```

### Test Case 3: Happy Path Login
```
Given: 
  - Usuario registrado: "juan_test@usuario.com" / "Password123!"
When:
  - Email: "juan_test@usuario.com"
  - Password: "Password123!"
  - Click Iniciar Sesión
Then:
  - POST /auth/login retorna 200 + { token: "..." }
  - Token se guarda en localStorage
  - Redirige a /reservas
  - Sidebar muestra "juan_test@usuario.com [USUARIO]"
```

### Test Case 4: Admin Login
```
Given:
  - Usuario admin registrado: "admin@usuario.com" / "Password123!"
  - Backend retorna role "ADMIN" en JWT
When:
  - Email: "admin@usuario.com"
  - Password: "Password123!"
  - Click Iniciar Sesión
Then:
  - Redirige a /admin (NO a /reservas)
  - Sidebar muestra "admin@usuario.com [ADMIN]"
  - Menú admin está visible
```

### Test Case 5: Protected Route Access
```
Given: Usuario logueado con token válido
When: Accede a /reservas (ruta protegida)
Then:
  - AuthGuard permite acceso
  - GET /api/reservas incluye "Authorization: Bearer {token}"
  - Server retorna datos
```

### Test Case 6: Unauthorized Access
```
Given: Sin token (no logueado)
When: Accede directamente a /reservas
Then:
  - AuthGuard bloquea
  - Redirige a /auth/login
  - NO hace request a /api/reservas
```

## 🚨 Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| CORS error en console | Backend CORS no configurado | Revisar WebMvcConfigurer en backend |
| 404 en POST /auth/login | Endpoint inexistente | Verificar path exacto en backend |
| Token no se guarda | Respuesta no tiene "token" field | Ajustar auth.service.ts línea 30 |
| Redirige a login infinito | No extrae role del JWT correctamente | Decodificar JWT en jwt.io, ajustar parsing |
| "Correo o contraseña incorrectos" siempre | Credenciales realmente incorrectas | Probar con POST en Postman |
| Admin NO ve /admin menu | role NO es "ADMIN" mayúsculas | Backend retorna "admin" minúsculas |
| Authorization header falta | Token NO está en localStorage | Verificar Step 3 de Paso 4 |

## 📝 Logs Esperados

### Login Exitoso (Console)
```
"Sending credentials" {username: "usuario@usuario.com", password: "..."}
"Response data:" {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
"Token saved:" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
"Login successful" {token: "..."}
```

### GET /api/reservas Exitoso
```
"InjectSessionInterceptor: Adjuntando token al request"
Network → GET /api/reservas
Headers → Authorization: Bearer eyJhbGc...
Response: [... array de reservas ...]
```

### Error de Credenciales
```
"Sending credentials" {username: "usuario@usuario.com", password: "..."}
Network → POST /auth/login → 401 Unauthorized
"Login failed" (error object)
UI → "Correo o contraseña incorrectos"
```

## ✅ Checklist Final

- [ ] Backend Spring Boot corriendo en 8080
- [ ] CORS habilitado para localhost:4200
- [ ] Endpoints existen: /api/usuarios, /auth/login, /api/reservas
- [ ] Frontend `npm start` corriendo en 4200
- [ ] Test 1: Registro funciona (POST /api/usuarios 201)
- [ ] Test 2: Login funciona (POST /auth/login 200 + token)
- [ ] Test 3: Token se guarda en localStorage
- [ ] Test 4: Authorized requests incluyen Authorization header
- [ ] Test 5: Protected routes redirigen si no hay token
- [ ] Test 6: Role-based navigation funciona
- [ ] Test 7: Logout limpia todo
- [ ] Test 8: Invalid credentials muestran error
