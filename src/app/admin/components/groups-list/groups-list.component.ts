import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../services/admin.service';
import { map } from 'rxjs/operators';
import { GroupModel } from '../../../group/models/group';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss']
})
export class GroupsListComponent implements OnInit {

  group: GroupModel[];

  constructor(private adminService: AdminService,
    public dialog: MatDialog) { }

    ngOnInit() {
      this.getUsers();
    }

    openDialog(sug) {

    }
    getUsers() {
      this.adminService.getGroups().pipe(
        map(sug =>
          sug.map(u => ({ key: u.payload.key, ...u.payload.val() }))
        )
      ).subscribe(result => {
        this.group = result;
      });
    }
}
