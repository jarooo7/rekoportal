import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { map } from 'rxjs/operators';
import { UserModel } from '../../../user/models/profile.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ChatService } from '../../services/chat.service';
import { MsgModel } from '../../models/msg.model';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-window-chat',
  templateUrl: './window-chat.component.html',
  styleUrls: ['./window-chat.component.scss']
})
export class WindowChatComponent implements  AfterViewChecked {
  @ViewChild('scrollMsg') private msgScroll: ElementRef;
  @Output() remove = new EventEmitter();
  @Input() msgId: string;
  @Input() set userId(id: string) {
    this.uid = id;
    this.classBar = 'bg-dark';
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.loadFriend(id);
        this.loadStat(id);
        this.isReadOut(this.msgId);
        this.newMsgList = [];
        this.msgs = new BehaviorSubject<MsgModel[]>([]);
        this.batch = 12;
        this.finish = false;
        this.getMsg(this.msgId);

        this.scrollToBottom();
      } else {
        if (this.sub) {
          this.sub.unsubscribe();
        }
      }
    });
  }
  sub;

  finish: boolean;
  startId: string;
  batch: number;
  classBar: string;
  lastKey: string;
  msgs = new BehaviorSubject<MsgModel[]>([]);
  newMsgList: MsgModel[] = [];
  isOpen = true;
  status: string;
  uid: string;
  msgList: MsgModel[];
  friend: UserModel;
  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.msgScroll.nativeElement.scrollTop = this.msgScroll.nativeElement.scrollHeight;
    } catch (err) { }
  }

  loadFriend(id: string) {

    this.sub = this.userService.getProfile(id).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(result => {
      this.friend = result;
    });
  }

  loadStat(id: string) {
    this.userService.getStat(id).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(result => {
      this.status = result.status;
    });
  }

  isReadOut(id: string) {
    this.chatService.isReadOut(id).pipe(
      map(f => ({ key: f.payload.key, ...f.payload.val() }))
    ).subscribe(result => {
        if (result.isRead) {
          this.classBar = 'notRead';
        } else {
          this.classBar = 'bg-dark';
        }
    });
  }

  readOut() {
    this.chatService.readOut(this.msgId);
  }

  isMyMsg(id: string) {
    if (id === this.uid) {
      return false;
    } else {
      return true;
    }
  }



  isOnline() {
    if (this.status) {
      if (this.status === 'online') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  goToUser() {
    this.router.navigate([`user/profile/${this.uid}`]);
  }

  minimize() {
    this.isOpen = false;
  }

  maximize() {
    this.isOpen = true;
  }
  public removeChat(): void {
    this.remove.emit();
  }

  private getMsg(id) {
    if (this.finish) { return; }
    let lastKey: string;
    const sub = this.chatService
    .getMsg(id, this.batch + 1 , this.lastKey)
    .pipe(
      map(result =>
        result.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
    .subscribe(msg => {
      if (this.finish) { return; }
      const msgR = msg.reverse();
      if (!this.lastKey && msgR[0]) {
        this.startId = msgR[0].timestamp;
      }
      this.loadNewMsg(id);
      msgR.forEach(c => {
          lastKey = c.timestamp;
      });
      if ((this.lastKey && this.lastKey === lastKey) || msgR.length <= this.batch ) {
        this.finish = true;
      }
      this.lastKey = lastKey;
      const newCom = _.slice(msgR, 0, this.batch);
      const currentCom = this.msgs.getValue();
      this.msgs.next( _.concat(newCom.reverse(), currentCom) );
      sub.unsubscribe();
    }
    );
  }

  loadNewMsg(id) {
    this.chatService
    .getNewMsg(id, this.startId  )
    .pipe(
      map(result =>
        result.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
    .subscribe(com => {
      let n = this.newMsgList.length;
      if (!this.startId && com[0]) {
      this.startId = com[0].timestamp;
      }
      if (this.msgs.getValue().length === 0 || (this.msgs.getValue().length === 0 && this.newMsgList.length !== 0)) {
        const com3 = _.slice(com, this.newMsgList.length);
        com3.forEach(c => {
          this.newMsgList[n] = c;
          n++;
        });
      } else {
      const com2 = _.slice(com, this.newMsgList.length + 1);
      com2.forEach(c => {
        this.newMsgList[n] = c;
        n++;
      });
      }
    });
  }

  next() {
    this.getMsg(this.msgId);
  }

}
