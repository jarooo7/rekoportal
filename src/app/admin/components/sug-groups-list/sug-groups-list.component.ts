import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { map } from 'rxjs/operators';
import { SugGroupModel } from '../../../group/models/suggestionGroup';
import { MatDialog } from '@angular/material';
import { PreviewSugGroupComponent } from '../preview-sug-group/preview-sug-group.component';

@Component({
  selector: 'app-sug-groups-list',
  templateUrl: './sug-groups-list.component.html',
  styleUrls: ['./sug-groups-list.component.scss']
})
export class SugGroupsListComponent implements OnInit {

  sug: SugGroupModel[];

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  openDialog(sug: SugGroupModel): void {
    this.dialog.open(PreviewSugGroupComponent, {
      maxWidth: '600px',
      minWidth: '400px',
      data: sug
    });
  }


  getUsers() {
    this.adminService.getSugGroups().pipe(
      map(sug =>
        sug.map(u => ({ key: u.payload.key, ...u.payload.val() }))
      )
    ).subscribe(result => {
      this.sug = result;
    });
  }

}
