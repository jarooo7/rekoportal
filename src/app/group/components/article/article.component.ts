import { Component, Input, Output, EventEmitter} from '@angular/core';
import { GropuService } from '../../services/gropu.service';
import { map } from 'rxjs/operators';
import { ArticleModel } from '../../models/article';
import { group } from '@angular/animations';
import { GroupModel } from '../../models/group';
import { RemoveArticleComponent } from '../remove-article/remove-article.component';
import { MatDialog } from '@angular/material/dialog';
import { EditArticleComponent } from '../edit-article/edit-article.component';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent  {

  @Input() set id(id: string) {
    this.articleId = id;
    this.loadArticle(id);
  }
  @Input() group: GroupModel;
  @Input() isAdmin: boolean;
  @Input() set uid(uid: string) {
    this.loadYorProfileUser(uid);
  }
  @Output() removeEmit = new EventEmitter();
  @Input() locId: string;
  article: ArticleModel;
  isAdminService = false;
  articleId: string;


  constructor(private groupService: GropuService,
    public dialog: MatDialog) { }

  loadArticle(id: string) {
    this.groupService.getThisArticle(id).pipe(
      map(article => ({ key: article.payload.key, ...article.payload.val() })
      )
    ).subscribe(res => {
      this.article = res;
    });
  }

  loadYorProfileUser(id: string) {
    this.groupService.getProfile(id).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(p => {
      this.isAdminService = p.isAdmin;
    });
  }

  remove(id: string) {
    const dialogRef = this.dialog.open(RemoveArticleComponent, {
      width: '400px',
      data: {groupId: this.group.key, id: id, photos: this.article.photoLoc, locId: this.locId, date:  this.article.date}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.removeEmit.emit();
    });
  }

  edit() {
    const dialogRef = this.dialog.open(EditArticleComponent, {
      minWidth: '60vw',
      maxWidth: '800px',
      data: {groupId: this.group.key, article: this.article}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.removeEmit.emit();
    });
  }

}
