import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { UserId } from '../../../user/models/profile.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss']
})
export class FriendsListComponent {

  friends: UserId[] = [];
  user: Observable<firebase.User>;
  search: string;
  chatId: string;
  selectFriends: string = null;

  constructor(
    private chatService: ChatService,
    private authService:  AuthService
  ) {
    this.user = authService.authState$;
    this.user.subscribe(u => {
      if (u) {
        if (u.uid) {
          this.gerFriends(u.uid);
        }
      }
    });
   }

  gerFriends(id: string) {
    this.chatService.getFriends(id).pipe(
      map(friends =>
        friends.map(f => ({ key: f.payload.key, ...f.payload.val() }))
      )
    ).subscribe(result => {
      console.log('fl', result);
      this.friends = result;
    });
  }

  openChat(id: UserId) {
    this.selectFriends = id.userId;
    this.chatId = id.msgId;
    console.log(id);
  }

  remove() {
    this.selectFriends = null;
  }

}
