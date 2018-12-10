import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  userId: string;

  constructor(
    private authService: AuthService
  ) {
    this.authService.authState$.subscribe(user => {
      if (user) {
        if (user.uid) {
          this.userId = user.uid;
        }
      }
    });
  }

  ngOnInit() {
  }

}
