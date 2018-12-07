import { Component, Input } from '@angular/core';
import { UserModel } from '../../../user/models/profile.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-result',
  templateUrl: './user-result.component.html',
  styleUrls: ['./user-result.component.scss']
})
export class UserResultComponent {

  @Input() user: UserModel;
  @Input() userId: string;
  @Input() imgClass: string;
  @Input() textClass: string;
  @Input() divClass: string;
  @Input() isClick: boolean;
  constructor(
    private router: Router
  ) { }

  goToUser() {
    if (this.isClick) {
      this.router.navigate([`user/profile/${this.userId}`]);
    }
  }

}
