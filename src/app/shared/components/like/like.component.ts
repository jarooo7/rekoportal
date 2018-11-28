import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.scss']
})
export class LikeComponent  {
  @Input() userId;
  @Input() set postKey(key: string) {
    this.key = key;
    this.isLiked = false;
    this.loadLike();
  }
  key: string;
  quantity: number;
  isLiked: boolean;
  isLikeKey: string;

  constructor(
   private userService: UserService
  ) { }
  addLike() {
    if (this.isLiked) {return; }
    this.userService.addLike(this.userId, this.key);
  }

  loadLike() {
    this.userService.getLike(this.userId, this.key).pipe(
      map(like =>
        like.map( l => ({ key: l.payload.key, ...l.payload.val() }))
      ))
    .subscribe(u => {
      this.quantity = u.length;
      u.forEach(result => {
        if (result.likeKey === this.userService.userId) {
          this.isLiked = true;
          this.isLikeKey = result.key;
        }
      }
      );
    });
  }
  delLike() {
    this.userService.delLike(this.userId, this.key, this.isLikeKey);
    this.isLiked = false;
  }

}
