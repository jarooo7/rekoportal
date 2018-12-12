import { Component, OnInit, Input, HostListener } from '@angular/core';
import { UserId } from '../../../user/models/profile.model';
import { TablePostService } from '../../services/table-post.service';
import { map } from 'rxjs/operators';
import { PostModel } from '../../../shared/models/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {


  @Input() friends: UserId[];
  @Input() userId: string;
  @Input() index: number;
  @Input() set addNewPost (start: number) {
    this.startEnd = start;
    this.newStartPost(start);
  }
  @Input() set start(start: number) {
    this.newEnd = start + 1;
    this.startPost = start;
    if (this.index >= this.friends.length) {
      this.startLoadPosts(start);
    }
  }
  @Input() end: number;
  posts: PostModel[] = [];
  startPost: number;
  newEnd: number;
  startEnd: number;
  loader = false;
  finished = false;
  nextStart: number;
  nextEnd: number;


  constructor(private postService: TablePostService) { }

  startLoadPosts(start: number) {
    if (!start || start === this.end) {
      return;
    }
    this.posts = [];
    const startLength = this.posts.length;
    let index = 0;
    const currentEnd = start - 28799999;
    this.nextStart = start;
    this.nextEnd = currentEnd;
    index++;
    this.loadPost(this.userId, start, currentEnd, index, startLength);
    this.friends.forEach(f => {
      index++;
      this.loadPost(f.userId, start, currentEnd, index, startLength);
    });
  }

  newStartPost(start: number) {
    const currentEnd = this.newEnd;
    this.newEnd = start + 1;
    this.loadNewPost(this.userId, start, currentEnd);
    this.friends.forEach(f => {
      this.loadNewPost(f.userId, start, currentEnd);
    });
  }

  nextLoad(start: number, end: number) {
    if (this.finished) {
      this.loader = false;
      return;
    }
    if (start < this.end) {
      this.finished = true;
    }
    const startLength = this.posts.length;
    this.nextStart = start;
    this.nextEnd = end;
    this.loader = true;
    let index = 0;
    const currentEnd = end;
    const currentStart = start;
    index++;
    this.loadPost(this.userId, currentStart, currentEnd, index, startLength );
    this.friends.forEach(f => {
      index++;
      this.loadPost(f.userId, currentStart, currentEnd, index, startLength );
    });
  }

  loadPost(id: string, start: number, end: number, index: number, startLength) {
    const sub = this.postService.getPosts(id, start, end).pipe(
      map(friends =>
        friends.map(f => ({ key: f.payload.key, ...f.payload.val() }))
      )
    ).subscribe(result => {
      if (result) {
        this.posts = this.posts.concat(result);
        if (index === this.friends.length + 1) {
          if (startLength === this.posts.length) {
            this.nextLoad(start - 28800000, end - 28800000);
          } else {
            this.posts = this.posts.sort((obj1, obj2) => {
              if (obj1.timestamp < obj2.timestamp) {
                return 1;
              }
              if (obj1.timestamp > obj2.timestamp) {
                return -1;
              }
              return 0;
            });
            this.loader = false;
          }
        }
      }
      sub.unsubscribe();
    });
  }

  loadNewPost(id: string, start: number, end: number) {
    const sub = this.postService.getPosts(id, start, end).pipe(
      map(friends =>
        friends.map(f => ({ key: f.payload.key, ...f.payload.val() }))
      )
    ).subscribe(result => {
      if (result) {
        const temp: PostModel[] = result;
        this.posts = temp.concat(this.posts);
        this.posts = this.posts.sort((obj1, obj2) => {
          if (obj1.timestamp < obj2.timestamp) {
            return 1;
          }
          if (obj1.timestamp > obj2.timestamp) {
            return -1;
          }
          return 0;
        });
      }
      sub.unsubscribe();
    });
  }

}
