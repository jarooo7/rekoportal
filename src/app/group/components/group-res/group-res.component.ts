import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GroupModel } from '../../models/group';

@Component({
  selector: 'app-group-res',
  templateUrl: './group-res.component.html',
  styleUrls: ['./group-res.component.scss']
})
export class GroupResComponent  {

  @Input() group: GroupModel;
  @Input() groupId: string;
  @Input() imgClass: string;
  @Input() textClass: string;
  @Input() divClass: string;
  @Input() isClick: boolean;
  constructor(
    private router: Router
  ) { }

  goToUser() {
     if (this.isClick) {
      this.router.navigate([`group/group/${this.groupId}`]);
    }
  }
}
