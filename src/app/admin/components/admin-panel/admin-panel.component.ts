import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { AdminService } from '../../services/admin.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  userId: string;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {
    this.authService.authState$.subscribe(user => {
      if (user) {
        if (user.uid) {
          this.userId = user.uid;
          this.adminService.getProfile(user.uid).pipe(
            map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
            )
          ).subscribe(u => {
            if (!u.isAdmin) {
              this.router.navigate([`table-post/posts`]);
            }
          });
        }
        }
      });
  }

  ngOnInit() {
  }

}
