# Quick Reference - Spring Boot Integration

## 🎯 Key URLs

| What | URL |
|------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8080 |
| Login | http://localhost:4200/auth/login |
| Register | http://localhost:4200/auth/register |
| Reservas (user) | http://localhost:4200/reservas |
| Admin Panel | http://localhost:4200/admin |

## 📡 API Endpoints

### Register
```
POST http://localhost:8080/api/usuarios
Content-Type: application/json

{
  "username": "nuevo_usuario",
  "email": "nuevo_usuario@usuario.com",
  "password": "password123",
  "roles": ["USUARIO"]
}

Response: 201
{
  "id": 1,
  "username": "nuevo_usuario",
  "email": "nuevo_usuario@usuario.com",
  "roles": ["USUARIO"]
}
```

### Login
```
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "username": "nuevo_usuario",
  "password": "password123"
}

Response: 200
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Reservas (Authorized)
```
GET http://localhost:8080/api/reservas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response: 200
[
  { "id": 1, "sala": "Sala A", "usuario": "nuevo_usuario", ... },
  ...
]
```

## 🔧 File Quick Links

| File | Purpose | Location |
|------|---------|----------|
| auth.service.ts | Main auth logic | `/src/app/modules/auth/services/` |
| auth-page.component.ts | Login form | `/src/app/modules/auth/pages/auth-page/` |
| register.component.ts | Registration form | `/src/app/modules/auth/pages/register/` |
| inject-session.interceptor.ts | Add Authorization header | `/src/app/core/interceptors/` |
| environments.ts | API URL config | `/src/environments/` |
| auth.guard.ts | Protect routes | `/src/app/core/guards/` |
| admin.guard.ts | Admin only routes | `/src/app/core/guards/` |

## 🧠 Key Code Snippets

### Login in Component
```typescript
this.authService.sendCredentials(email, password).subscribe({
  next: (response) => {
    const role = this.authService.getUserRole();
    if (role === 'admin' || role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/reservas']);
    }
  },
  error: (error) => {
    this.errorMessage = 'Correo o contraseña incorrectos';
  }
});
```

### Check if Admin
```typescript
if (this.authService.isAdmin()) {
  // Show admin menu
}
```

### Get Current User
```typescript
const email = this.authService.getUserEmail();
const role = this.authService.getUserRole();
```

### Logout
```typescript
this.authService.logout();
this.router.navigate(['/auth/login']);
```

### Use in Interceptor (Automatic)
```typescript
// Don't need to do anything! The interceptor automatically adds:
// Authorization: Bearer {token}
// To all requests
```

## 🧪 Test Users

### With Mock Backend (`useAuthServiceMock = true` in auth.module.ts)
- **Admin**: admin@example.com / password123
- **User**: usuario@example.com / password123
- **User 2**: maria@example.com / password123

### With Spring Boot Backend
Create your own users via registration at http://localhost:4200/auth/register

## 🐛 Common Issues

### "CORS error"
```
❌ Error: Access to XMLHttpRequest blocked by CORS policy
✅ Fix: Enable CORS in Spring Boot backend for http://localhost:4200
```

### "Correo o contraseña incorrectos"
```
❌ Could mean:
  - User doesn't exist in backend
  - Password is wrong
  - Endpoint /auth/login doesn't exist
  
✅ Debug with:
  - DevTools Network tab → POST /auth/login
  - Check response status and body
  - Test with Postman
```

### "Blank page after login"
```
❌ Usually means role extraction failed
✅ Check:
  - console.log shows "Response data"
  - JWT has "role" field
  - localStorage has "userRole" set
```

### "Token not sent with requests"
```
❌ Authorization header missing
✅ Check:
  - localStorage has "token"
  - interceptor is registered in app.module
  - NetworkTab shows "Authorization: Bearer ..."
```

## 🎬 Quick Start

### 1. Start Backend
```bash
cd backend-project
mvn spring-boot:run
# Wait for "Started in X seconds"
```

### 2. Start Frontend
```bash
cd frontend
npm start
# Automatically opens http://localhost:4200
```

### 3. Test
- Go to http://localhost:4200/auth/register
- Create account: anything@usuario.com / password
- Go to http://localhost:4200/auth/login
- Login with created account
- Should see /reservas or /admin page

## 📊 Architecture Overview

```
┌─────────────────────────────────────┐
│      Browser / Angular Frontend     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   auth.service              │   │
│  │   - sendCredentials()       │   │
│  │   - registrar()             │   │
│  │   - getUserRole()           │   │
│  │   - logout()                │   │
│  └──────────────┬──────────────┘   │
│                 │                  │
│  ┌──────────────▼──────────────┐   │
│  │   HTTP Client + Interceptor │   │
│  │   (adds Authorization header)   │
│  └──────────────┬──────────────┘   │
└─────────────────┼──────────────────┘
                  │
         http://localhost:8080
                  │
┌─────────────────▼──────────────────┐
│     Spring Boot Backend             │
│                                     │
│  /api/usuarios (POST)               │
│  /auth/login (POST)                 │
│  /api/reservas (GET)                │
│  /api/salas (GET)                   │
│  /admin/* (GET/POST)                │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  JWT Token Validation         │  │
│  │  Role-based Access Control    │  │
│  │  Password Encryption (BCrypt) │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 🔐 Security Features

✅ JWT Token-based authentication
✅ Password encryption (BCrypt on backend)
✅ Role-based access control (ADMIN / USUARIO)
✅ Protected routes with AuthGuard and AdminGuard
✅ Automatic token injection in requests
✅ Token storage in both cookies and localStorage
✅ Logout clears all session data
✅ CORS protection
✅ Bearer token in Authorization header

## 📞 Getting Help

1. Check **SPRING-BOOT-INTEGRATION.md** for detailed integration info
2. Check **TESTING-GUIDE.md** for testing procedures
3. Look at **console logs** for error messages
4. Check **DevTools Network tab** for request/response details
5. Use **jwt.io** to decode JWT tokens and verify claims

## ✨ Key Features

- ✅ User registration with @usuario.com email validation
- ✅ User login with JWT token
- ✅ Role-based navigation (admin vs regular user)
- ✅ Protected routes with guards
- ✅ Automatic token injection in all HTTP requests
- ✅ User identification in sidebar
- ✅ Logout clears all data
- ✅ Mock backend for development
- ✅ Real Spring Boot backend integration

---

**Last Updated**: Based on Spring Boot backend at http://localhost:8080
**Environment**: Angular 15+, Spring Boot, JWT, CORS enabled
