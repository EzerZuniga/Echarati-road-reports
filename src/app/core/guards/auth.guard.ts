import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated) return true;
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: router.routerState.snapshot.url }
  });
};

export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated) {
    return router.createUrlTree(['/auth/login']);
  }
  const required: UserRole = route.data['role'];
  if (required && auth.currentUser?.role !== required) {
    return router.createUrlTree(['/reports']);
  }
  return true;
};
