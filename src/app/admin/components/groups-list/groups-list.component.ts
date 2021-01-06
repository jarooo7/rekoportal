import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../services/admin.service';
import { map } from 'rxjs/operators';
import { GroupModel } from '../../../group/models/group';
import { AdminGroupComponent } from '../../../group/components/admin-group/admin-group.component';

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
      this.getGroups();
    }

    openDialog(group: GroupModel): void {
      const dialogRef = this.dialog.open(AdminGroupComponent, {
      minWidth: '300px',
      maxWidth: '600px',
      data: group.key
      });
    }

      getGroups() {
      this.adminService.getGroups().pipe(
        map(sug =>
          sug.map(u => ({ key: u.payload.key, ...u.payload.val() }))
        )
      ).subscribe(result => {
        this.group = result;
      });
    }
}
