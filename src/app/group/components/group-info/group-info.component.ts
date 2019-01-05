import { Component, Input } from '@angular/core';
import { GroupModel } from '../../models/group';
import { GropuService } from '../../services/gropu.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss']
})
export class GroupInfoComponent {

  @Input() set id(gid: string) {
    this.loadGroup(gid);
    this.groupId = gid;
  }

  groupId: string;
  group: GroupModel;

  constructor(private groupService: GropuService,
    private router: Router
  ) { }
  goToUser() {
    this.router.navigate([`group/group/${this.groupId}`]);
  }

  loadGroup(id: string) {
    this.groupService.getGroup(id).pipe(
      map(group => ({ key: group.payload.key, ...group.payload.val() })
      )
    ).subscribe(res => {
      this.group = res;
    });
  }
}
