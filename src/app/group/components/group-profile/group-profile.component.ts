import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GropuService } from '../../services/gropu.service';
import { takeUntil, map } from 'rxjs/operators';
import { GroupModel } from '../../models/group';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { AddArticleComponent } from '../add-article/add-article.component';
import { AuthService } from '../../../auth/services/auth.service';
import { getFormatedDate } from '../../../shared/functions/format-date';
import { AvatarModel } from '../../../user/models/profile.model';
import { EditGroupComponent } from '../edit-group/edit-group.component';
import { AdminGroupComponent } from '../admin-group/admin-group.component';

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
  user: Observable<firebase.User>;
  finish: boolean;
  userId: string;
  isAdmin = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GropuService,
    public dialog: MatDialog,
    private authService:  AuthService
  ) {
    this.user = authService.authState$;
    this.user.subscribe(u => {
      if (u) {
        if (u.uid) {
          this.userId = u.uid;
        }
      }
    });
   }

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

  goToArmy(name: string) {
    this.router.navigate(['/group/selected-groups/' + name]);
  }

  loadGroup() {
    this.groupService.getGroup(this.groupId).pipe(
      map(group => ({ key: group.payload.key, ...group.payload.val() })
      )
    ).subscribe(res => {
      this.group = res;
      this.isAdmin = false;
      res.admins.forEach(r => {
        if (r === this.userId) {
          this.isAdmin = true;
        }
      });
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


  uploadAvatar(event) {
    if (!event) { return; }
    let avatar: AvatarModel;
    const type = event.target.files[0].type;
    const date = getFormatedDate(new Date());
    const id = Math.random().toString(36).substring(2);
    this.groupService.resizeAvatar(event.target.files[0]).subscribe(result => {
      this.groupService.upload2Avatar(
        new File([result], 'photo', { type: type, lastModified: Date.now()}),
        date, id, this.groupId).then(p => {
          p.ref.getDownloadURL().then(
            url => {
              avatar = new AvatarModel; {
                avatar.url = url;
                avatar.location = `${date}/${id}`;
              }
              this.groupService.addAvatar(avatar, this.groupId);
            });
          });
    });
  }
  editAvatar(event) {
    this.groupService.deleteAvatar(this.groupId, this.group.avatar.location);
    this.uploadAvatar(event);
  }

  editGroup() {
    const dialogRef = this.dialog.open(EditGroupComponent, {
      minWidth: '300px',
      maxWidth: '600px',
      data: this.group
    });
  }

  adminGroup() {
    const dialogRef = this.dialog.open(AdminGroupComponent, {
      minWidth: '300px',
      maxWidth: '600px',
      data: this.group.key
    });
  }

}
