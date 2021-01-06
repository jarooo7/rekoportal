import { Component, Input } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { UserModel } from '../../../user/models/profile.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-invit-list',
  templateUrl: './invit-list.component.html',
  styleUrls: ['./invit-list.component.scss']
})
export class InvitListComponent  {
  @Input() set uid(id: string) {
    this.userId = id;
    this.getUser();
  }
  @Input() key: string;
  userId: string;
  user: UserModel;

  constructor(private userService: UserService) { }

  getUser() {
    this.userService.getProfile(this.userId).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(p => {
      this.user = p;
    });
  }

  addFriends() {
    this.userService.addFriends(this.userId, this.key);
  }

  removeFriends() {
    this.userService.removeinvitFriends(this.userId, this.key);
  }

}
