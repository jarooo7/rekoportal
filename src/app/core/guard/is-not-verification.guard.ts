import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsNotVerificationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {

  }
  canActivate(): Observable<boolean> {
      return this.authService.authState$.pipe(map(state => {
        if (state !== null) {
          if (this.authService.isEmailVerification()) {
            this.router.navigate(['/table-post/posts']);
            return false;
          }
            return true;
          }
        this.router.navigate(['/auth/login']);
        return false;
        }
      )
    );
  }
}
