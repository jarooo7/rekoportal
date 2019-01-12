import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GropuService } from '../../services/gropu.service';
import { ArticleIdModel } from '../../models/article';

@Component({
  selector: 'app-remove-article',
  templateUrl: './remove-article.component.html',
  styleUrls: ['./remove-article.component.scss']
})
export class RemoveArticleComponent {


  constructor(
    private groupService: GropuService,
    public dialogRef: MatDialogRef<RemoveArticleComponent>,
    @Inject(MAT_DIALOG_DATA) public date: ArticleIdModel
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  remove() {
    this.groupService.removeArticle(this.date.id).then(
      () => {
        this.groupService.removeArticleLocation(this.date.groupId, this.date.locId);
        this.groupService.removeLike(this.date.groupId, this.date.id);
        this.groupService.removeCom(this.date.groupId, this.date.id);
        if (this.date.date) {
          this.date.photos.forEach(p => {
            this.groupService.removePhoto(this.date.groupId, this.date.date, p);
          });
        }
        this.onNoClick();
      }
    );
  }
}
