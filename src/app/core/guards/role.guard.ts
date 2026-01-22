import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../modules/auth/services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string;

  if (!requiredRole) {
    return true; // no se exige rol
  }

  if (!authService.hasRole(requiredRole)) {
    router.navigate(['/reservas']);
    return false;
  }

  return true;
};
