import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../shared';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);
  const router = inject(Router);
  try {
    const { user, session } = await authService.refresh();
    if (!user || !session) {
      throw new Error();
    }
    return true;
  } catch (error) {
    router.navigate(['/']);
    storageService.clear();
    return false;
  }
};
