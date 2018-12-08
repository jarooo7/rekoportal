import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { UserId } from '../../user/models/profile.model';
import { MsgModel } from '../models/msg.model';
import * as firebase from 'firebase/app';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  userId: string;

  constructor(
    private dataBase: AngularFireDatabase,
    private authService: AuthService
  ) {
    this.authService.authState$.subscribe(user => {
      if (user) {
        if (user.uid) {
          this.userId = user.uid;
        }
      }
    });
  }

  getFriends(id: string) {
    let result: AngularFireList<UserId> = null;
    result = this.dataBase.list(`friends/${id}`);
    return result.snapshotChanges();
  }

  time() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  sentMsg(key: string, text: string) {
    const comment: AngularFireList<MsgModel> = this.dataBase.list(`msg/${key}`);
    let msg: MsgModel;
    msg = new MsgModel; {
      msg.timestamp = this.time();
      msg.text = text;
      msg.userId = this.userId;
    }
    return comment.push(msg);
  }
}
