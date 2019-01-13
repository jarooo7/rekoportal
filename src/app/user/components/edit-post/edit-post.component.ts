import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditPosteModel, PostModel } from '../../../shared/models/post.model';
import { getFormatedDate } from '../../../shared/functions/format-date';
import { takeUntil } from 'rxjs/operators';

enum FormControlNames {
  POST = 'post'
}

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {

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
    private userService: UserService,
    public dialogRef: MatDialogRef<EditPostComponent>,
    @Inject(MAT_DIALOG_DATA) public date: EditPosteModel
  ) { }

  ngOnInit() {
    this.openEmoji = false;
    this.articleForm = this.formBuilder.group({
      [FormControlNames.POST]: ['', [Validators.required, Validators.maxLength(1500)]]
    });
    this.setFormValue();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addEmoji($event) {
    const text = this.articleForm.get(FormControlNames.POST).value;
    this.articleForm.get(FormControlNames.POST).setValue(`${text}${$event.emoji.native}`);
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
    if (this.date.post.date) {
      today = this.date.post.date;
    } else {
      today = getFormatedDate(new Date);
    }
    let article: PostModel;
    if (this.photos && this.photos.length !== 0) {
      this.photos.forEach(
        file => {
          id = Math.random().toString(36).substring(2);
          photoUrl.push(`${index}-${id}`);
          this.userService.uploadPhoto2(
            today,
            `${index}-${id}`, file, this.date.userId).then(p => {
              p.ref.getDownloadURL().then(
                url => {
                  urlList.push(url);
                  if (this.photos.length === index2 + 1) {
                    article = new PostModel; {
                      article.timestamp = timestamp;
                      article.text = this.articleForm.get(FormControlNames.POST).value;
                      article.photos = this.oldPhotos.concat(urlList);
                      article.date = today;
                      article.key = this.date.post.key;
                      article.photoLoc = this.oldPhotosLoc.concat(photoUrl);
                    }
                    this.userService.editPost(article, this.date.userId).then(() => {
                      this.roldPhotosLoc.forEach(r => {
                        this.userService.removePhoto(this.date.userId, this.date.post.date, r);
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
      article = new PostModel; {
        article.timestamp = timestamp;
        article.key = this.date.post.key;
        article.date = today;
        article.photos = this.oldPhotos;
        article.photoLoc = this.oldPhotosLoc;
        article.text = this.articleForm.get(FormControlNames.POST).value;
      }
      this.userService.editPost(article, this.date.userId).then(() => {
        this.roldPhotosLoc.forEach(r => {
          this.userService.removePhoto(this.date.userId, this.date.post.date, r);
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
      [FormControlNames.POST]: this.date.post.text
    });
    if (this.date.post.photos) {
      this.oldPhotos = this.date.post.photos;
      this.oldPhotosLoc = this.date.post.photoLoc;
    }
  }

  resetForm() {
    this.onNoClick();
  }
}

