import { Component, Input } from '@angular/core';
import { UserModel } from '../../../user/models/profile.model';
import { UserService } from '../../../user/services/user.service';
import { map } from 'rxjs/internal/operators/map';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent  {
  @Input() set idUser(id: string) {
    this.userId = id;
    this.isAvatar = false;
    this.loadProfileUser();
  }
  @Input() text: string;
  userId: string;
  user: UserModel;
  avatar: string;
  isAvatar: boolean;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  loadProfileUser() {
    this.userService.getProfile(this.userId).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(p => {
      this.user = new UserModel(); {
        this.user.name = p.name;
        this.user.lastName = p.lastName;
        this.user.dateBirth = p.dateBirth;
        this.user.avatar = p.avatar;
      }
      if (this.user.avatar) {
      this.avatar = this.userService.getAvatar(this.user.avatar.url, this.userId);
      this.isAvatar = true;
    }
    });
  }

}
