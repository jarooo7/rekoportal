import { Injectable } from '@angular/core';
import { UserId } from '../../user/models/profile.model';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { PostModel } from '../../shared/models/post.model';

@Injectable({
  providedIn: 'root'
})
export class TablePostService {

  constructor(private dataBase: AngularFireDatabase) { }

  getFriends(id: string) {
    let result: AngularFireList<UserId> = null;
    result = this.dataBase.list(`friends/${id}`);
    return result.snapshotChanges();
  }

  getPosts(userId: string, start: number, end: number) {
    let post: AngularFireList<PostModel> = null;
    post = this.dataBase.list(`post/${userId}`, ref => ref.orderByChild('timestamp').startAt(end).endAt(start));
    return post.snapshotChanges();
  }
  getEndPosts(userId: string) {
    let post: AngularFireList<PostModel> = null;
    post = this.dataBase.list(`post/${userId}`, ref => ref.orderByChild('timestamp').limitToFirst(1));
    return post.snapshotChanges();
  }

  getStartdPosts(userId: string) {
    let post: AngularFireList<PostModel> = null;
    post = this.dataBase.list(`post/${userId}`, ref => ref.orderByChild('timestamp').limitToLast(1));
    return post.snapshotChanges();
  }

}
