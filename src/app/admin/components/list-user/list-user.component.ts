import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { map } from 'rxjs/operators';
import { UserModel } from '../../../user/models/profile.model';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {

  users: UserModel[] = [];

  constructor(
   private adminService: AdminService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.adminService.getProfiles().pipe(
      map(users =>
        users.map(u => ({ key: u.payload.key, ...u.payload.val() }))
      )
    ).subscribe(result => {
      this.users = result;
    });
  }
  addAdmin(id: string) {
    this.adminService.addAdmin(id);
  }

  delAdmin(id: string) {
    this.adminService.delAdmin(id);
  }

}
