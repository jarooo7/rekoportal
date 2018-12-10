import { Component, Input } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { UserId, UserModel } from '../../../user/models/profile.model';
import { map } from 'rxjs/operators';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {

  @Input() set getFriend(uid: UserId) {
    this.friendId = uid;
    this.isRead = false;
    this.isReadOut(uid.msgId);
    this.loadFriend();
    this.loadStat(uid.userId);
  }
  @Input() searchText: string;
  isRead: boolean;
  friendId: UserId;
  status: string;
  friend: UserModel;
  constructor(private userService: UserService,
    private chatService: ChatService
  ) { }

  isReadOut(id: string) {
    this.chatService.isReadOut(id).pipe(
      map(f => ({ key: f.payload.key, ...f.payload.val() }))
    ).subscribe(result => {
        if (result.isRead) {
          this.isRead = true;
        } else {
          this.isRead = false;
        }
    });
  }

  loadFriend() {
    this.userService.getProfile(this.friendId.userId).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(result => {
      this.friend = result;
      console.log('fl2');
    });
  }

  loadStat(id: string) {
    this.userService.getStat(id).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(result => {
      this.status = result.status;
      console.log(result);
    });
  }

  isOnline() {
    if (this.status) {
      if (this.status === 'online') {
        console.log('aktywny');
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
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
