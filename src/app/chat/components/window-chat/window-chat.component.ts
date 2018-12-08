import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { map } from 'rxjs/operators';
import { UserModel } from '../../../user/models/profile.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-window-chat',
  templateUrl: './window-chat.component.html',
  styleUrls: ['./window-chat.component.scss']
})
export class WindowChatComponent {
  @Output() remove = new EventEmitter();
  @Input() msgId: string;
  @Input() set userId(id: string) {
    this.uid = id;
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.loadFriend(id);
        this.loadStat(id);
      } else {
        if (this.sub) {
          this.sub.unsubscribe();
        }
      }

    });
  }
  sub;
  isOpen = true;
  status: string;
  uid: string;
  friend: UserModel;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  loadFriend(id: string) {

    this.sub = this.userService.getProfile(id).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(result => {
      this.friend = result;
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

  goToUser() {
    this.router.navigate([`user/profile/${this.uid}`]);
  }

  minimize() {
    this.isOpen = false;
  }

  maximize() {
    this.isOpen = true;
  }
  public removeChat(): void {
    this.remove.emit();
  }
}
