import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import { AddGroupComponent } from '../add-group/add-group.component';
import { GroupModel } from '../../models/group';
import { AdminService } from '../../../admin/services/admin.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss']
})
export class GroupsListComponent implements OnInit {

  result: GroupModel[];
  isUser = false;
  constructor(private adminService: AdminService,
    authService: AuthService,
    public dialog: MatDialog) {
      authService.authState$.subscribe(user => {
        if (user) {
          this.isUser = true;
        }});
    }

  ngOnInit() {
    this.getGroups();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddGroupComponent, {
      maxWidth: '600px',
      minWidth: '400px',
    });
  }

  getGroups() {
    this.adminService.getGroups().pipe(
      map(sug =>
        sug.map(u => ({ key: u.payload.key, ...u.payload.val() }))
      )
    ).subscribe(result => {
      this.result = result;
    });
  }


}
