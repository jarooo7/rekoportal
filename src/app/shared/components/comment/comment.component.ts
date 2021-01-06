import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserModel } from '../../../user/models/profile.model';
import { UserService } from '../../../user/services/user.service';
import { map } from 'rxjs/internal/operators/map';
import { Router } from '@angular/router';
import { ComModel } from '../../models/post.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent  {
  @Input() set com(com: ComModel) {
    this.commant = com;
    this.userId = com.userKey;
    if (this.yourId) {
      if (this.yourId === com.userKey) {
        this.your = true;
      }
    }
    this.loadProfileUser();
  }
  @Input() key: string;
  @Output() removeCom = new EventEmitter();
  commant: ComModel;
  userId: string;
  user: UserModel;
  isAdmin: boolean;
  your = false;
  yourId: string;
  userSub: Observable<firebase.User>;
  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.userSub = userService.user;
    this.userSub.subscribe(u => {
      if (u) {
        if (u.uid) {
          this.yourId = u.uid;
          if (this.userId) {
            if (this.userId === u.uid) {
              this.your = true;
            }
          }
          this.loadYorProfileUser(u.uid);
        }
      }
    });
   }

  loadProfileUser() {
    this.userService.getProfile(this.userId).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(p => {
      this.user = p;
    });
  }

  loadYorProfileUser(id: string) {
    this.userService.getProfile(id).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(p => {
      this.isAdmin = p.isAdmin;
    });
  }

  goToUser() {
    this.router.navigate([`/user/profile/${this.userId}`]);
  }

  remove() {
    this.userService.removeCom(this.key, this.commant.key);
    this.removeCom.emit();
  }

}
