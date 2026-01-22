# Architecture & Flow Diagrams

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                   YOUR BROWSER                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Angular Frontend (localhost:4200)          │   │
│  │                                                     │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Components (Login, Register, Pages)         │  │   │
│  │  │  - auth-page.component.ts (login)            │  │   │
│  │  │  - register.component.ts (register)          │  │   │
│  │  │  - reservas-page.component.ts (protected)    │  │   │
│  │  └────────────┬─────────────────────────────────┘  │   │
│  │               │                                      │   │
│  │  ┌────────────▼─────────────────────────────────┐  │   │
│  │  │  AuthService (auth.service.ts)              │  │   │
│  │  │  - sendCredentials() → POST /auth/login      │  │   │
│  │  │  - registrar() → POST /api/usuarios          │  │   │
│  │  │  - getUserRole() → Get from localStorage     │  │   │
│  │  │  - logout() → Clear all data                 │  │   │
│  │  └────────────┬─────────────────────────────────┘  │   │
│  │               │                                      │   │
│  │  ┌────────────▼─────────────────────────────────┐  │   │
│  │  │  HttpClient with Interceptor                 │  │   │
│  │  │  - Adds Authorization: Bearer {token}        │  │   │
│  │  │  - Routes all requests                       │  │   │
│  │  │  - Gets token from localStorage/cookies      │  │   │
│  │  └────────────┬─────────────────────────────────┘  │   │
│  │               │                                      │   │
│  │  ┌────────────▼─────────────────────────────────┐  │   │
│  │  │  Route Guards                                │  │   │
│  │  │  - AuthGuard: Requires token                │  │   │
│  │  │  - AdminGuard: Requires ADMIN role          │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  │               │                                      │   │
│  └───────────────┼──────────────────────────────────┘  │
│                  │                                       │
│   LocalStorage:  │  Token Storage:                      │
│   • token        │  • localStorage['token']             │
│   • userRole     │  • cookies['token']                  │
│   • userEmail    │                                      │
│                  │                                       │
└──────────────────┼───────────────────────────────────────┘
                   │ HTTP/REST
                   │ http://localhost:8080
                   ▼
┌────────────────────────────────────────────────────────────┐
│              Spring Boot Backend (8080)                    │
│  ┌────────────────────────────────────────────────────┐   │
│  │  REST Controller                                   │   │
│  │                                                    │   │
│  │  POST /auth/login                                 │   │
│  │    Input:  {username, password}                   │   │
│  │    Output: {token: "eyJ..."}                      │   │
│  │                                                    │   │
│  │  POST /api/usuarios (Register)                    │   │
│  │    Input:  {username, email, password, roles}     │   │
│  │    Output: {id, username, email, roles}           │   │
│  │                                                    │   │
│  │  GET /api/reservas (Protected)                    │   │
│  │    Header: Authorization: Bearer {token}          │   │
│  │    Output: [{...}, {...}, ...]                    │   │
│  │                                                    │   │
│  │  GET /api/salas                                   │   │
│  │  GET /admin/usuarios                              │   │
│  │  etc...                                            │   │
│  └────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Security Layer                                    │   │
│  │  - JWT Token Validation                           │   │
│  │  - Role-based Access Control                      │   │
│  │  - Password Encryption (BCrypt)                   │   │
│  │  - CORS Policy (localhost:4200)                   │   │
│  └────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Database                                          │   │
│  │  • usuarios (id, username, email, password_hash)  │   │
│  │  • roles (id, name)                               │   │
│  │  • reservas (id, sala, usuario, fecha, hora)      │   │
│  │  • salas (id, nombre, capacidad)                  │   │
│  └────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### Registration Flow
```
┌─ User clicks "Crear Cuenta"
│
├─ Navigate to /auth/register
│  └─ RegisterComponent loads
│     ├─ Form: username, email, password, confirmar
│     └─ Validators:
│        ├─ Email must end with @usuario.com
│        └─ Password must match confirm
│
├─ User fills form and clicks "Registrar"
│
├─ Component validates form
│  └─ If invalid → Show error, stay on page
│
├─ Component calls authService.registrar(data)
│  └─ AuthService sends:
│     POST http://localhost:8080/api/usuarios
│     Body: {
│       "username": "nuevo_usuario",
│       "email": "nuevo_usuario@usuario.com",
│       "password": "password123",
│       "roles": ["USUARIO"]
│     }
│
├─ Backend processes
│  ├─ Validate input
│  ├─ Hash password with BCrypt
│  ├─ Create user in database
│  └─ Return user object (201 Created)
│
├─ Frontend receives response
│  ├─ Subscribe.next() triggered
│  ├─ Log success
│  └─ Navigate to /auth/login
│
└─ User sees login page, can now login

```

### Login Flow  
```
┌─ User enters email and password on /auth/login
│
├─ Component validates form
│  └─ Both fields required, email format
│
├─ Component calls authService.sendCredentials(email, password)
│  └─ AuthService sends:
│     POST http://localhost:8080/auth/login
│     Body: {
│       "username": "usuario@usuario.com",
│       "password": "password123"
│     }
│
├─ Backend validates
│  ├─ Find user by username
│  ├─ Verify password (BCrypt.check)
│  ├─ Generate JWT token
│  └─ Return {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
│
├─ Frontend processes response
│  ├─ Extract: data.token
│  ├─ Save to cookies: cookieService.set('token', token)
│  ├─ Save to localStorage: localStorage.setItem('token', token)
│  │
│  ├─ Decode JWT (atob function)
│  │  ├─ Split token by '.'
│  │  ├─ Get payload part (index 1)
│  │  └─ Decode: JSON.parse(atob(payload))
│  │     Result: {sub: "...", role: "USUARIO", iat: ..., exp: ...}
│  │
│  ├─ Extract role
│  │  ├─ payload.role = "USUARIO"
│  │  └─ Save: localStorage.setItem('userRole', "USUARIO")
│  │
│  └─ Save email: localStorage.setItem('userEmail', "usuario@usuario.com")
│
├─ Component gets role
│  ├─ authService.getUserRole() → "USUARIO"
│  └─ IF role === 'admin' || 'ADMIN'
│     ├─ Navigate to /admin
│     └─ ELSE Navigate to /reservas
│
├─ Page loads with Authorization header
│  └─ Interceptor adds: Authorization: Bearer {token}
│
└─ User logged in successfully!

```

### Protected Request Flow
```
┌─ User clicks link to /reservas or makes API request
│
├─ Component calls: httpClient.get('/api/reservas')
│  └─ HTTP request created
│
├─ INTERCEPTOR triggered (InjectSessionInterceptor)
│  ├─ Gets token from cookies: cookieService.get('token')
│  ├─ If not found, gets from localStorage: localStorage.getItem('token')
│  ├─ Clones request with header:
│  │  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
│  └─ Returns modified request
│
├─ Browser sends request
│  REQUEST Headers:
│  ├─ Host: localhost:8080
│  ├─ Authorization: Bearer eyJ...
│  └─ Content-Type: application/json
│
├─ Backend receives request
│  ├─ Extracts: Authorization header
│  ├─ Validates JWT:
│  │  ├─ Check signature
│  │  ├─ Check expiration (exp claim)
│  │  └─ Extract user info from payload
│  ├─ Check user role
│  │  ├─ IF ADMIN: allow access to /admin routes
│  │  ├─ ELSE IF USUARIO: allow only user routes
│  │  └─ ELSE: return 403 Forbidden
│  └─ Process request and return data
│
├─ Response sent
│  RESPONSE:
│  ├─ Status: 200 OK
│  └─ Body: [{id: 1, sala: "Sala A", ...}, ...]
│
├─ Frontend receives response
│  ├─ Component.subscribe.next() called
│  ├─ Update page with data
│  └─ User sees information
│
└─ Request complete

```

### Logout Flow
```
┌─ User clicks "Logout" button in sidebar
│
├─ Component calls authService.logout()
│  └─ AuthService:
│     ├─ cookieService.delete('token')
│     ├─ localStorage.removeItem('userRole')
│     └─ localStorage.removeItem('userEmail')
│
├─ All session data cleared
│  └─ Storage now empty
│
├─ Component navigates to /auth/login
│
└─ User logged out!
   └─ If tries to access protected route:
      ├─ AuthGuard checks: localStorage.getItem('token')
      ├─ Finds: null
      └─ Redirects to /auth/login

```

---

## 🔄 Request/Response Examples

### Register Request
```http
POST http://localhost:8080/api/usuarios HTTP/1.1
Content-Type: application/json
Content-Length: 118

{
  "username": "nuevo_usuario",
  "email": "nuevo_usuario@usuario.com",
  "password": "password123",
  "roles": ["USUARIO"]
}
```

### Register Response
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 5,
  "username": "nuevo_usuario",
  "email": "nuevo_usuario@usuario.com",
  "roles": ["USUARIO"]
}
```

### Login Request
```http
POST http://localhost:8080/auth/login HTTP/1.1
Content-Type: application/json
Content-Length: 68

{
  "username": "nuevo_usuario",
  "password": "password123"
}
```

### Login Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJudWV2b191c3VhcmlvIiwicm9sZSI6IlVTVUFSSU8iLCJpYXQiOjE2NzcwMDAwMDAsImV4cCI6MTY3NzAwMzYwMH0.dVjXKQPbHXQ..."
}
```

### Protected Request (with Authorization)
```http
GET http://localhost:8080/api/reservas HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJudWV2b191c3VhcmlvIiwicm9sZSI6IlVTVUFSSU8iLCJpYXQiOjE2NzcwMDAwMDAsImV4cCI6MTY3NzAwMzYwMH0.dVjXKQPbHXQ...
Content-Type: application/json
```

### Protected Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "sala": "Sala A",
    "usuario": "nuevo_usuario",
    "fecha": "2024-01-15",
    "hora": "14:00"
  },
  {
    "id": 2,
    "sala": "Sala B",
    "usuario": "nuevo_usuario",
    "fecha": "2024-01-16",
    "hora": "15:00"
  }
]
```

### Failed Authorization
```http
GET http://localhost:8080/api/reservas HTTP/1.1
Authorization: Bearer invalid_token_or_expired

Response:
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Invalid or expired token"
}
```

---

## 🧬 JWT Token Structure

### What is JWT?
A JWT consists of three parts separated by dots:
```
header.payload.signature
```

### Full Token Example
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJudWV2b191c3VhcmlvIiwicm9sZSI6IlVTVUFSSU8iLCJpYXQiOjE2NzcwMDAwMDAsImV4cCI6MTY3NzAwMzYwMH0.
dVjXKQPbHXQ...
```

### Header (Base64 Decoded)
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload (Base64 Decoded) ← Frontend parses this
```json
{
  "sub": "nuevo_usuario",
  "role": "USUARIO",
  "iat": 1677000000,
  "exp": 1677003600
}
```

### Frontend Decoding (in auth.service.ts)
```typescript
const payload = JSON.parse(atob(token.split('.')[1]));
// payload.role = "USUARIO"
// payload.exp = 1677003600 (expiration time)
```

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: Transport Security                       │
│  • HTTPS in production (HTTP ok for dev/localhost) │
│  • Encrypts token in transit                       │
└─────────────────────────────────────────────────────┘
                        ▲
┌─────────────────────────────────────────────────────┐
│  Layer 2: Token Storage                            │
│  • localStorage (readable from JS)                 │
│  • Cookies (httpOnly flag recommended)             │
│  • Token never exposed in URL                      │
└─────────────────────────────────────────────────────┘
                        ▲
┌─────────────────────────────────────────────────────┐
│  Layer 3: JWT Validation                           │
│  • Signature verification (secret key)             │
│  • Expiration check (exp claim)                    │
│  • Tamper detection (signature invalid)            │
└─────────────────────────────────────────────────────┘
                        ▲
┌─────────────────────────────────────────────────────┐
│  Layer 4: Role-based Access Control                │
│  • Check role in JWT payload                       │
│  • Allow/deny based on role                        │
│  • Separate guards for different permission levels │
└─────────────────────────────────────────────────────┘
                        ▲
┌─────────────────────────────────────────────────────┐
│  Layer 5: Password Security                        │
│  • Passwords hashed with BCrypt (backend)          │
│  • Never stored or transmitted in plaintext        │
│  • Salted hashes prevent rainbow tables            │
└─────────────────────────────────────────────────────┘
```

---

## 📊 State Management

### localStorage After Login
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userRole": "USUARIO",
  "userEmail": "usuario@usuario.com"
}
```

### Cookies After Login
```
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; Max-Age=14400;
```

### After Logout
```javascript
{
  // EMPTY
}
```

---

## 🎯 Component Interactions

```
┌──────────────────────────────────────────────────────────┐
│                  User Interaction                        │
│                                                          │
│  1. Clicks "Registrar" link                            │
│     ↓                                                    │
│  2. Fills registration form                            │
│     ↓                                                    │
│  3. Clicks "Registrar" button                          │
│     └─→ RegisterComponent.registrar()                  │
│         └─→ AuthService.registrar(data)               │
│             └─→ POST /api/usuarios                    │
│                 └─→ Backend                           │
│                     └─→ Database                      │
│                         ↓                             │
│  4. Success: Navigate to /auth/login                 │
│                                                       │
│  5. Clicks "Iniciar Sesión"                          │
│     ↓                                                 │
│  6. Fills login form                                 │
│     ↓                                                 │
│  7. Clicks "Iniciar Sesión" button                   │
│     └─→ AuthPageComponent.sendLogin()                │
│         └─→ AuthService.sendCredentials(...)        │
│             └─→ POST /auth/login                     │
│                 └─→ Backend JWT generation           │
│                     └─→ Response: {token: "..."}     │
│                         ↓                            │
│  8. Token stored in localStorage + cookies           │
│     ↓                                                │
│  9. Role extracted from JWT                         │
│     ↓                                                │
│  10. Navigate to /reservas or /admin                │
│      ↓                                               │
│  11. Page loads (AuthGuard allows access)            │
│      ↓                                               │
│  12. GET /api/reservas with Authorization header    │
│      └─→ Interceptor adds token                     │
│          └─→ Backend validates token               │
│              └─→ Returns data                       │
│                  ↓                                  │
│  13. UI displays reservations                       │
│      ↓                                              │
│  14. User clicks Logout                            │
│      └─→ AuthService.logout()                      │
│          └─→ Clear token, role, email             │
│              └─→ Navigate to /auth/login           │
│                  ↓                                 │
│  15. AuthGuard redirects to login                 │
│      ↓                                            │
│  Cycle complete!                                  │
└──────────────────────────────────────────────────────────┘
```

---

## ✅ Complete Integration Summary

All components work together to create secure, role-based authentication:

1. **User Interface** → auth-page.component.ts, register.component.ts
2. **Business Logic** → auth.service.ts (login, register, logout)
3. **HTTP Layer** → inject-session.interceptor.ts (adds Authorization header)
4. **Routing Security** → auth.guard.ts, admin.guard.ts (protects routes)
5. **Data Storage** → localStorage + cookies (token & role)
6. **Backend Communication** → Spring Boot REST API

**Result**: Secure, role-based Angular application connected to Spring Boot backend!
