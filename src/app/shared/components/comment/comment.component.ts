import { Component, Input } from '@angular/core';
import { UserModel } from '../../../user/models/profile.model';
import { UserService } from '../../../user/services/user.service';
import { map } from 'rxjs/internal/operators/map';
import { Router } from '@angular/router';
import { ComModel } from '../../models/post.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent  {
  @Input() set com(com: ComModel) {
    this.commant = com;
    this.userId = com.userKey;
    this.loadProfileUser();
  }
  commant: ComModel;
  userId: string;
  user: UserModel;

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
    });
  }

  goToUser() {
    this.router.navigate([`/user/profile/${this.userId}`]);
  }

}
