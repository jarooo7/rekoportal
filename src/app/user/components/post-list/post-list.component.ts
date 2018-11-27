import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserService } from '../../services/user.service';
import * as _ from 'lodash';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent  {
  @Input() set getUser(userId: string) {
    this.posts = new BehaviorSubject([]);
    this.userId =  userId;
    this.finish = false;
    this.getPost();
  }
  userId: string;
  posts = new BehaviorSubject([]);
  batch = 4;
  lastKey: string;
  finish: boolean;

  constructor(
    private userService: UserService
  ) { }
  onScroll () {
    console.log('scrolled!!');
    this.getPost();
  }

  private getPost() {
    if (this.finish) { return; }
    let lastKey: string;
    let flag = true;
    this.userService
    .getMyPosts(this.userId, this.batch + 1 , this.lastKey)
    .pipe(
      map(posts =>
        posts.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
    .subscribe(post => {
      if (flag) {
      post.forEach(p => {
        lastKey = p.timestamp;
      });
      if (this.lastKey && this.lastKey === lastKey) {
        this.finish = true;
        return;
      }
      this.lastKey = lastKey;
      const newPost = _.slice(post, 0, this.batch);
      const currentPost = this.posts.getValue();
      this.posts.next( _.concat(currentPost, newPost) );
      flag = false;
    }
    });
  }
}
