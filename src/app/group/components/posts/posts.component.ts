import { Component, OnInit } from '@angular/core';
import { GropuService } from '../../services/gropu.service';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { GroupModel } from '../../models/group';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  article = new BehaviorSubject([]);
  batch = 2;
  lastKey: string;
  finish: boolean;

  constructor(
    private groupService: GropuService,
  ) { }

  ngOnInit() {
    this.getPost();
  }

  onScroll () {
    this.getPost();
  }

  private getPost() {
    if (this.finish) { return; }
    let lastKey: string;
    const sub = this.groupService
    .getGlobalArticle(this.batch + 1 , this.lastKey)
    .pipe(
      map(article =>
        article.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
    .subscribe(post => {
      if (this.finish) { return; }
      const articleR = post.reverse();
      articleR.forEach(p => {
          lastKey = p.timestamp;
      });
      if ((this.lastKey && this.lastKey === lastKey) || articleR.length === this.batch ) {
        this.finish = true;
      }
      this.lastKey = lastKey;
      const newArticle = _.slice(articleR, 0, this.batch);
      const currentArticle = this.article.getValue();
      this.article.next( _.concat(currentArticle, newArticle) );
      sub.unsubscribe();
    });
  }


}
