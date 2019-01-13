import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserService } from '../../services/user.service';
import * as _ from 'lodash';
import { map, tap } from 'rxjs/operators';
import { UserModel } from '../../models/profile.model';
import { Observable } from 'rxjs';
import { PostModel } from '../../../shared/models/post.model';
import { RemovePostComponent } from '../remove-post/remove-post.component';
import { MatDialog } from '@angular/material/dialog';
import { EditPostComponent } from '../edit-post/edit-post.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent  {
  @Input() set getUser(userId: string) {
    this.posts = new BehaviorSubject([]);
    this.userId = userId;
    this.isYour = false;
    this.lastKey = null;
    this.finish = false;
    if (this.yorUserId) {
      if (this.yorUserId === userId) {
        this.isYour = true;
      }
    }
    this.getPost();
  }

  @Input() set refresh(key: string) {
    if (key !== 'start') {
    this.posts = new BehaviorSubject([]);
    this.lastKey = null;
    this.finish = false;
    this.getPost();
    }
  }

  @Input() user: UserModel;
  userId: string;
  posts = new BehaviorSubject([]);
  batch = 4;
  lastKey: string;
  isYour = false;
  isAdmin = false;
  finish: boolean;
  yorUserId: string;
  userSub: Observable<firebase.User>;

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) {
    this.userSub = userService.user;
    this.userSub.subscribe(u => {
      if (u) {
        if (u.uid) {
          this.isYour = false;
          this.yorUserId = u.uid;
          this.getProfile(u.uid);
          if (this.userId) {
            if (u.uid === this.userId) {
              this.isYour = true;
            }
          }
        }
      }
    });
  }
    onScroll () {
    this.getPost();
  }

  private getPost() {
    if (this.finish) { return; }
    let lastKey: string;
    const sub = this.userService
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
      sub.unsubscribe();
    });
  }

  getProfile(id: string) {
    this.userService.getProfile(id).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(p => {
      this.isAdmin = p.isAdmin;
    });
  }

  remove(post: PostModel) {
    const dialogRef = this.dialog.open(RemovePostComponent, {
      width: '400px',
      data: {userId: this.user.key, id: post.key, photos: post.photoLoc, date:  post.date}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.posts = new BehaviorSubject([]);
      this.lastKey = null;
      this.finish = false;
      this.getPost();
    });
  }

  edit(post: PostModel) {
    const dialogRef = this.dialog.open(EditPostComponent, {
      minWidth: '60vw',
      maxWidth: '800px',
      data: {userId: this.user.key, post: post}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.posts = new BehaviorSubject([]);
      this.lastKey = null;
      this.finish = false;
      this.getPost();
    });
  }

}
