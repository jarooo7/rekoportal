import { Component, Input } from '@angular/core';
import { PostModel } from '../../../shared/models/post.model';
import { UserService } from '../../../user/services/user.service';
import { map } from 'rxjs/operators';
import { UserModel } from '../../../user/models/profile.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {

  @Input() set loadPost(post: PostModel) {
    this.post = post;
    this.loadProfile(post.userId);
  }
  post: PostModel;
  user: UserModel;

  constructor(
    private userService: UserService) { }

  loadProfile(id: string) {
    this.userService.getProfile(id).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(p => {
      this.user = p;
    });
  }
}
