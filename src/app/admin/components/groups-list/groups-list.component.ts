import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../services/admin.service';
import { map } from 'rxjs/operators';
import { GroupModel } from '../../../group/models/group';
import { PreviewGroupComponent } from '../preview-group/preview-group.component';

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
      this.dialog.open(PreviewGroupComponent, {
        maxWidth: '600px',
        minWidth: '400px',
        data: group
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
