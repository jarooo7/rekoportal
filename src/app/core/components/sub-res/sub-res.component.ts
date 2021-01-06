import { Component, OnInit, Input } from '@angular/core';
import { GroupModel, SubModel } from '../../../group/models/group';
import { GropuService } from '../../../group/services/gropu.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ThisArticleComponent } from '../../../shared/components/this-article/this-article.component';

@Component({
  selector: 'app-sub-res',
  templateUrl: './sub-res.component.html',
  styleUrls: ['./sub-res.component.scss']
})
export class SubResComponent  {
  @Input() set id(a: SubModel) {
    this.loadGroup(a.groupId);
    this.art = a;
    if (a.read) {
      this.color = '';
    } else {
      this.color = 'bg-light';
    }
  }

  color = '';
  art: SubModel;
  group: GroupModel;

  constructor(private groupService: GropuService,
    public dialog: MatDialog
  ) { }
  goToArticle() {
    this.groupService.readSub(this.art.idArticle);
    const dialogRef = this.dialog.open(ThisArticleComponent, {
      minWidth: '60vw',
      maxWidth: '800px',
      data: {group: this.group, article: this.art.idArticle}
    });
  }

  loadGroup(id: string) {
    this.groupService.getGroup(id).pipe(
      map(group => ({ key: group.payload.key, ...group.payload.val() })
      )
    ).subscribe(res => {
      this.group = res;
    });
  }

}
