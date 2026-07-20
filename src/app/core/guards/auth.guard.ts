import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = await auth.waitUntilReady();

  const screen = _route.data?.['permission'] as Parameters<AuthService['canRead']>[0] | undefined;
  return user
    ? (!screen || auth.canRead(screen) ? true : router.createUrlTree(['/admin']))
    : router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: state.url } });
};

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = await auth.waitUntilReady();

  return user ? router.createUrlTree(['/admin']) : true;
};
