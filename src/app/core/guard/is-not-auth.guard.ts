import { Injectable } from '@angular/core';
import { CanActivate,  Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsNotAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {

  }
  canActivate(): Observable<boolean> {
      return this.authService.authState$.pipe(map(state => {
        if (state === null) { return true; }
        if (this.authService.isEmailVerification()) {
          // this.router.navigate(['/']);
          return false;
        } else {
          this.router.navigate(['/not-active-user/not-active']);
        }
        return false;
        }
      )
    );
  }
}
