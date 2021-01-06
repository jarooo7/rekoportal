import { Component, OnInit, Inject } from '@angular/core';
import { GropuService } from '../../services/gropu.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { GroupModel } from '../../models/group';
import { SearchResultsService } from '../../../search/services/search-results.service';
import { getFormatedSearch } from '../../../shared/functions/format-search-text';
import { UserModel } from '../../../user/models/profile.model';
import { FormGroup, FormBuilder } from '@angular/forms';
enum FormControlNames {
  SEARCH = 'search'
}
@Component({
  selector: 'app-admin-group',
  templateUrl: './admin-group.component.html',
  styleUrls: ['./admin-group.component.scss']
})
export class AdminGroupComponent implements OnInit {
 group: GroupModel;
 result: UserModel[] = [];
 searchForm: FormGroup;
 formControlNames = FormControlNames;
  constructor(
    private groupService: GropuService,
    private searchService: SearchResultsService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AdminGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public groupId: string
  ) {}
  ngOnInit( ) {
    this.searchForm = this.formBuilder.group({
      [FormControlNames.SEARCH]: ['']
    });
    this.loadGroup();
  }
  loadGroup() {
    this.groupService.getGroup(this.groupId).pipe(
      map(group => ({ key: group.payload.key, ...group.payload.val() })
      )
    ).subscribe(res => {
      this.group = res;
    });
  }

  removeAdmin(id) {
    const admins: string[] = this.group.admins;
    admins.splice(id, 1);
    this.groupService.updateAdminsGroup(this.group.key, admins);
  }

  addAdmin(id: string) {
    if (!this.group.admins) {
      this.groupService.setAdminsGroup(this.group.key, [id]);
    } else {
    const admins: string[] = this.group.admins;
    admins.push(id);
    this.groupService.updateAdminsGroup(this.group.key, admins);
    }
  }

  searchNow(event) {
    const textSearch = getFormatedSearch(event.toLocaleLowerCase());
    if (textSearch.length < 3) {
      this.result = [];
      return;
    }
    this.searchService.getUser(textSearch, textSearch + '\uf8ff')
      .pipe(
        map(like =>
          like.map(l => ({ key: l.payload.key, ...l.payload.val() }))
        ))
      .subscribe(u => {
        this.result = u;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
