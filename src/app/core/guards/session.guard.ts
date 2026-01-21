
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


const checkSession = () : boolean => {
  try {
    const cookeService = inject(CookieService);
    const token = cookeService.check('token');
    return token;

  } catch (error) {
    return false;
  }

}


export const sessionGuard: CanActivateFn = (route, state) => {
  const isValidSession = checkSession();
  const router = inject(Router);

  if (!isValidSession) {
    router.navigate(['/auth']);
    return false; 
  }

  return true;
};
