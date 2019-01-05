import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GropuService } from '../../services/gropu.service';
import { takeUntil, map } from 'rxjs/operators';
import { GroupModel } from '../../models/group';
import { Subject, BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { AddArticleComponent } from '../add-article/add-article.component';

@Component({
  selector: 'app-group-profile',
  templateUrl: './group-profile.component.html',
  styleUrls: ['./group-profile.component.scss']
})
export class GroupProfileComponent implements OnInit {

  groupId: string;
  group: GroupModel;
  backgroundUrl = '../../../../assets/standardBG.jpg';
  destroy$: Subject<boolean> = new Subject<boolean>();
  article = new BehaviorSubject([]);
  batch = 2;
  lastKey: string;
  finish: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GropuService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.readRouting();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddArticleComponent, {
      minWidth: '60vw',
      maxWidth: '800px',
      data: this.group.key
    });
  }

  refresh() {}

  readRouting() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.groupId = null;
      this.groupId = params['id'];
      this.loadRouting();
    });
  }

  loadRouting() {
    if (!this.groupId) {
      this.router.navigate(['/group/groups-list']);
    } else {
      this.loadGroup();
      this.article = new BehaviorSubject([]);
      this.lastKey = null;
      this.finish = false;
      this.getPost();
    }
  }

  loadGroup() {
    this.groupService.getGroup(this.groupId).pipe(
      map(group => ({ key: group.payload.key, ...group.payload.val() })
      )
    ).subscribe(res => {
      this.group = res;
    });
  }

  onScroll () {
    this.getPost();
  }

  private getPost() {
    if (this.finish) { return; }
    let lastKey: string;
    const sub = this.groupService
    .getArticle(this.groupId, this.batch + 1 , this.lastKey)
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
