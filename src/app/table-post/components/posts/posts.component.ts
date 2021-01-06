import { Component, OnInit } from '@angular/core';
import { UserId } from '../../../user/models/profile.model';
import { TablePostService } from '../../services/table-post.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  friends: UserId[] = [];
  user: Observable<firebase.User>;
  userId: string;
  indexStart: number;
  indexNewStart: number;
  newStart: number;
  start: number;
  end: number;

  constructor(
    private postService: TablePostService,
    private authService:  AuthService
  ) {
    this.user = authService.authState$;
    this.user.subscribe(u => {
      if (u) {
        if (u.uid) {
          this.userId = u.uid;
          this.gerFriends(u.uid);
        }
      }
    });
  }

  ngOnInit() {
  }

  gerFriends(id: string) {
    const sub = this.postService.getFriends(id).pipe(
      map(friends =>
        friends.map(f => ({ key: f.payload.key, ...f.payload.val() }))
      )
    ).subscribe(result => {
      this.friends = result;
      this.loadRangePost(result);
      sub.unsubscribe();
    });
  }

  loadEndPost(id: string) {
   const sub = this.postService.getEndPosts(id).pipe(
    map(post =>
      post.map( p => ({ key: p.payload.key, ...p.payload.val() }))
    )
  ).subscribe(result => {
    if (result[0].timestamp) {
      if (!this.end || this.end > result[0].timestamp) {
        this.end = result[0].timestamp;
      }
    }
    sub.unsubscribe();
  });
}
  loadStartPost(id: string) {
    const sub = this.postService.getStartdPosts(id).pipe(
      map(post =>
        post.map( p => ({ key: p.payload.key, ...p.payload.val() }))
      )
    ).subscribe(result => {
      if (result[0].timestamp) {
        if (!this.start || this.start < result[0].timestamp) {
          this.start = result[0].timestamp;
        }
      }
      sub.unsubscribe();
    });
  }

  refresh() {
    this.loadRangePost(this.friends);
  }

  loadRangePost(friends: UserId[]) {
    this.indexStart = 0;
    this.loadStartPost(this.userId);
    this.loadEndPost(this.userId);
    friends.forEach(f => {
      this.indexStart++;
      this.loadEndPost(f.userId);
      this.loadStartPost(f.userId);
    }
    );
  }


  loadNewStart() {
    const sub = this.postService.getStartdPosts(this.userId).pipe(
      map(post =>
        post.map( p => ({ key: p.payload.key, ...p.payload.val() }))
      )
    ).subscribe(result => {
      if (result[0].timestamp) {
        if (!this.newStart || this.newStart < result[0].timestamp) {
          this.newStart = result[0].timestamp;
        }
      }
      sub.unsubscribe();
    });
  }

}
