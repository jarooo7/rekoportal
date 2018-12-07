import { Component, Input } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { UserId, UserModel } from '../../../user/models/profile.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {

  @Input() set getFriend(uid: UserId) {
    this.friendId = uid;
    console.log(' chuju tu jestem raz dwa 3', uid);
    this.loadFriend();
  }
  @Input() searchText: string;
  friendId: UserId;
  friend: UserModel;
  constructor(private userService: UserService
  ) { }

  loadFriend() {
    this.userService.getProfile(this.friendId.userId).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(result => {
      this.friend = result;
      console.log('fl2');
    });
  }

  filter() {
    if (!this.friend) {
      return false;
    }
    if (!this.searchText) {
      return true;
    } else {
      const search = this.friend.name + ' ' + this.friend.lastName;
      if (search.toLowerCase().includes(this.searchText)) {
        return true;
      } else {
        return false;
      }
    }
  }
}
