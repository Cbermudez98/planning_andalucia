import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../shared';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);
  const router = inject(Router);
  try {
    const { data, error } = await authService.isLogin();
    if (data?.session) {
      router.navigate(['/index']);
      return false;
    }
    return true;
  } catch (error) {
    storageService.clear();
    return true;
  }
};
