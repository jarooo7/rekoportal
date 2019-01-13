import { Component, OnInit, EventEmitter, Output, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { GropuService } from '../../services/gropu.service';
import { UserService } from '../../../user/services/user.service';
import { ArticleModel, EditArticleModel } from '../../models/article';
import { getFormatedDate } from '../../../shared/functions/format-date';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

enum FormControlNames {
  TITLE = 'title',
  ARTICLE = 'article'
}

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit {

    imageSrc: string[] = [];
    photos: File[] = [];
    articleForm: FormGroup;
    oldPhotos: string[] = [];
    oldPhotosLoc: string[] = [];
    roldPhotosLoc: string[] = [];
    formControlNames = FormControlNames;
    openEmoji: boolean;
    isHovering: boolean;
    destroy$: Subject<boolean> = new Subject<boolean>();


    constructor(
      private formBuilder: FormBuilder,
      private alert: AlertService,
      private translate: TranslateService,
      private groupService: GropuService,
      private userService: UserService,
      public dialogRef: MatDialogRef<EditArticleComponent>,
      @Inject(MAT_DIALOG_DATA) public date: EditArticleModel
    ) { }

    ngOnInit() {
      this.openEmoji = false;
      this.articleForm = this.formBuilder.group({
        [FormControlNames.ARTICLE]: ['', [Validators.required, Validators.maxLength(100)]],
        [FormControlNames.TITLE]: ['', [Validators.required, Validators.maxLength(1500)]]
      });
      this.setFormValue();
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    addEmoji($event) {
      const text = this.articleForm.get(FormControlNames.ARTICLE).value;
      this.articleForm.get(FormControlNames.ARTICLE).setValue(`${text}${$event.emoji.native}`);
      this.openEmoji = false;
    }

    openEmojiPopup() {
      this.openEmoji = !this.openEmoji;
    }

    closeEmojiPopup() {
      this.openEmoji = false;
    }

    preview(file: File, i: number) {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => this.imageSrc[i] = reader.result as string;
        reader.readAsDataURL(file);
      }
    }

    toggleHover(event: boolean) {
      this.isHovering = event;
    }

    addPhoto(event: FileList) {
      let index: number;
      let type: string;
      if (this.imageSrc) {
        index = this.imageSrc.length;
      } else {
        index = 0;
      }
      Array.from(event).forEach(file => {
        if (file.type.split('/')[0] === 'image') {
          type = file.type;
          this.userService.resize(file).subscribe(result => {
            const reFile: File = new File([result], 'photo', { type: type, lastModified: Date.now() });
            this.photos.push(reFile);
            this.imageSrc.push('');
            this.preview(reFile, index);
            index++;
          });
        }
      });
    }

    removePhoto(index: number) {
      this.imageSrc.splice(index, 1);
      this.photos.splice(index, 1);
    }

    removeOldPhoto(index: number) {
      this.roldPhotosLoc.push(this.oldPhotosLoc[index]);
      this.oldPhotos.splice(index, 1);
      this.oldPhotosLoc.splice(index, 1);
    }

    onSubmit() {
      if (!this.articleForm.valid) { return; }
      const urlList: string[] = [];
      const photoUrl: string[] = [];
      const timestamp = this.userService.time();
      let index = 0;
      let index2 = 0;
      let id: string;
      let today;
      if (this.date.article.date) {
        today = this.date.article.date;
      } else {
        today = getFormatedDate(new Date);
      }
      let article: ArticleModel;
      if (this.photos && this.photos.length !== 0) {
        this.photos.forEach(
          file => {
            id = Math.random().toString(36).substring(2);
            photoUrl.push(`${index}-${id}`);
            this.groupService.uploadPhoto(
              today,
              `${index}-${id}`, file, this.date.groupId).then(p => {
                p.ref.getDownloadURL().then(
                  url => {
                    urlList.push(url);
                    if (this.photos.length === index2 + 1) {
                      article = new ArticleModel; {
                        article.timestamp = timestamp;
                        article.text = this.articleForm.get(FormControlNames.ARTICLE).value;
                        article.title = this.articleForm.get(FormControlNames.TITLE).value;
                        article.groupId = this.date.groupId;
                        article.photos = this.oldPhotos.concat(urlList);
                        article.date = today;
                        article.key = this.date.article.key;
                        article.photoLoc = this.oldPhotosLoc.concat(photoUrl);
                      }
                      this.groupService.editArticle(article).then(() => {
                        this.roldPhotosLoc.forEach(r => {
                          this.groupService.removePhoto(this.date.groupId, this.date.article.date, r);
                        });
                        this.translate
                          .get('alert.success.addPost')
                          .pipe(takeUntil(this.destroy$))
                          .subscribe(translation => {
                            this.alert.showNotification('success', translation);
                          });
                          this.resetForm();
                      }, () => {
                        this.translate
                          .get('alert.error.addPost')
                          .pipe(takeUntil(this.destroy$))
                          .subscribe(translation => {
                            this.alert.showNotification('error', translation);
                          });
                      }
                      );
                    }
                    index2++;
                  }
                );
              }
              );
              index++;
          });
      } else {
        article = new ArticleModel; {
          article.timestamp = timestamp;
          article.groupId = this.date.groupId;
          article.key = this.date.article.key;
          article.date = today;
          article.photos = this.oldPhotos;
          article.photoLoc = this.oldPhotosLoc;
          article.text = this.articleForm.get(FormControlNames.ARTICLE).value;
          article.title = this.articleForm.get(FormControlNames.TITLE).value;
        }
        this.groupService.editArticle(article).then(() => {
          this.roldPhotosLoc.forEach(r => {
            this.groupService.removePhoto(this.date.groupId, this.date.article.date, r);
          });
          this.translate
            .get('alert.success.addPost')
            .pipe(takeUntil(this.destroy$))
            .subscribe(translation => {
              this.alert.showNotification('success', translation);
            });
            this.resetForm();
        }, () => {
          this.translate
            .get('alert.error.addPost')
            .pipe(takeUntil(this.destroy$))
            .subscribe(translation => {
              this.alert.showNotification('error', translation);
            });
        }
        );
      }
    }

    setFormValue() {
      this.articleForm.setValue({
        [FormControlNames.TITLE]: this.date.article.title,
        [FormControlNames.ARTICLE]: this.date.article.text
      });
      if (this.date.article.photos) {
        this.oldPhotos = this.date.article.photos;
        this.oldPhotosLoc = this.date.article.photoLoc;
      }
    }

    resetForm() {
      this.onNoClick();
    }
  }

