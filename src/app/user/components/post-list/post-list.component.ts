import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserService } from '../../services/user.service';
import * as _ from 'lodash';
import { map, tap } from 'rxjs/operators';
import { UserModel } from '../../models/profile.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent  {
  @Input() set getUser(userId: string) {
    this.posts = new BehaviorSubject([]);
    this.userId = userId;
    this.lastKey = null;
    this.finish = false;
    this.getPost();
  }
  @Input() user: UserModel;
  userId: string;
  posts = new BehaviorSubject([]);
  batch = 4;
  lastKey: string;
  finish: boolean;

  constructor(
    private userService: UserService
  ) { }
  onScroll () {
    this.getPost();
  }

  private getPost() {
    if (this.finish) { return; }
    let lastKey: string;
    this.userService
    .getMyPosts(this.userId, this.batch + 1 , this.lastKey)
    .pipe(
      map(posts =>
        posts.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
    .subscribe(post => {
      if (this.finish) { return; }
      const postR = post.reverse();
      postR.forEach(p => {
          lastKey = p.timestamp;
      });
      if ((this.lastKey && this.lastKey === lastKey) || postR.length === this.batch ) {
        this.finish = true;
      }
      this.lastKey = lastKey;
      const newPost = _.slice(postR, 0, this.batch);
      const currentPost = this.posts.getValue();
      this.posts.next( _.concat(currentPost, newPost) );
    });
  }
}
