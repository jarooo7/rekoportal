import { Component, Input, OnDestroy } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { map, takeUntil, throttleTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as _ from 'lodash';
import { Subject, Subscriber } from 'rxjs';
import { ComModel } from '../../models/post.model';

@Component({
  selector: 'app-view-comment',
  templateUrl: './view-comment.component.html',
  styleUrls: ['./view-comment.component.scss']
})
export class ViewCommentComponent implements  OnDestroy {

  @Input() userId: string;
  @Input() set keyPost(key: string) {
    this.comments = new BehaviorSubject([]);
    this.keyP = key;
    this.batch = 2;
    this.finish = false;
    this.getCom();
  }
  keyP: string;
  finish: boolean;
  startId: string;
  batch: number;
  operation: boolean;
  lastKey: string;
  comments = new BehaviorSubject<ComModel[]>([]);
  newComments: ComModel[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private userService: UserService) { }

  remove() {
    this.newComments = [];
    this.lastKey = null;
    this.comments = new BehaviorSubject([]);
    this.batch = 2;
    this.startId = null;
    this.finish = false;
  }

  private getCom() {
    if (this.finish) { return; }
    let lastKey: string;
    const sub = this.userService
    .getCom(this.userId, this.keyP, this.batch + 1 , this.lastKey)
    .pipe(
      takeUntil(this.destroy$),
      map(result =>
        result.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
    .subscribe(com => {
      if (this.finish) { return; }
      const comR = com.reverse();
      if (!this.lastKey && comR[0]) {
        this.startId = comR[0].timestamp;
      }
      this.loadNewCom();
      comR.forEach(c => {
          lastKey = c.timestamp;
      });
      if ((this.lastKey && this.lastKey === lastKey) || comR.length <= this.batch ) {
        this.finish = true;
      }
      this.lastKey = lastKey;
      const newCom = _.slice(comR, 0, this.batch);
      const currentCom = this.comments.getValue();
      this.comments.next( _.concat(newCom.reverse(), currentCom) );
      sub.unsubscribe();
    }
    );
  }

  loadNewCom() {
    this.userService
    .getNewCom(this.userId, this.keyP, this.startId  )
    .pipe(
      map(result =>
        result.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
    .subscribe(com => {
      let n = this.newComments.length;
      if (!this.startId && com[0]) {
      this.startId = com[0].timestamp;
      }
      if (this.comments.getValue().length === 0 || (this.comments.getValue().length === 0 && this.newComments.length !== 0)) {
        const com3 = _.slice(com, this.newComments.length);
        com3.forEach(c => {
          this.newComments[n] = c;
          n++;
        });
      } else {
      const com2 = _.slice(com, this.newComments.length + 1);
      com2.forEach(c => {
        this.newComments[n] = c;
        n++;
      });
      }
    });
  }

  next() {
    this.getCom();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

