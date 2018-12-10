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
    const message: AngularFireList<MsgModel> = this.dataBase.list(`msg/${key}`);
    let msg: MsgModel;
    msg = new MsgModel; {
      msg.timestamp = this.time();
      msg.text = text;
      msg.userId = this.userId;
    }
    return message.push(msg);
  }

  // getMsg(key: string) {
  //   const msg: AngularFireList<MsgModel> = this.dataBase.list(`msg/${key}`);
  //   return msg.snapshotChanges();
  // }

  getMsg(id: string, batch: number, lastKey?: string) {
    let com: AngularFireList<MsgModel> =  null;
    if (lastKey) {
      com = this.dataBase.list(`msg/${id}`, ref => ref.orderByChild('timestamp').limitToLast(batch).endAt(lastKey));
    } else {
      com = this.dataBase.list(`msg/${id}`, ref => ref.orderByChild('timestamp').limitToLast(batch));
    }
    return com.snapshotChanges();
  }

  getNewMsg(id: string, startKey: string) {
    let com: AngularFireList<MsgModel> =  null;
    com = this.dataBase.list(`msg/${id}`, ref => ref.orderByChild('timestamp').startAt(startKey));
    return com.snapshotChanges();
  }
}
