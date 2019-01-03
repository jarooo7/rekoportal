import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupModel } from '../../../group/models/group';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-preview-group',
  templateUrl: './preview-group.component.html',
  styleUrls: ['./preview-group.component.scss']
})
export class PreviewGroupComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    public dialogRef: MatDialogRef<PreviewGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public group: GroupModel) {}

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  removeAdmin(id) {
    this.adminService.removeAdminGroup(this.group.key, id);
  }
}
