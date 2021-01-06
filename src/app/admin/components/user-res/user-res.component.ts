import { Component, Input } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { UserModel } from '../../../user/models/profile.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-res',
  templateUrl: './user-res.component.html',
  styleUrls: ['./user-res.component.scss']
})
export class UserResComponent {
  @Input() set userId(uid: string) {
    this.uid = uid;
    this.getProfil(uid);
  }
  uid: string;
  user:  UserModel;

  constructor(private adminService: AdminService) { }

  getProfil(uid: string) {
    this.adminService.getProfile(uid).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(u => this.user = u);
  }
}
