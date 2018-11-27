import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { PostModel } from '../../../shared/models/post.model';
import { getFormatedDate } from '../../../shared/functions/format-date';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase';

enum FormControlNames {
  POST = 'post'
}

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})

export class AddPostComponent implements OnInit {

  imageSrc: string[] = [];
  photos: File[] = [];
  postForm: FormGroup;
  formControlNames = FormControlNames;
  openEmoji: boolean;
  isHovering: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(
    private formBuilder: FormBuilder,
    private alert: AlertService,
    private translate: TranslateService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.openEmoji = false;
    this.postForm = this.formBuilder.group({
      [FormControlNames.POST]: ['', [Validators.required]]
    });
  }

  addEmoji($event) {
    const text = this.postForm.get(FormControlNames.POST).value;
    this.postForm.get(FormControlNames.POST).setValue(`${text}${$event.emoji.native}`);
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
    if (this.imageSrc) {
      index = this.imageSrc.length;
    } else {
      index = 0;
    }
    Array.from(event).forEach(file => {
      if (file.type.split('/')[0] === 'image') {
        this.imageSrc.push('');
        this.preview(file, index);
        index++;
        this.photos.push(file);
      }
    });
  }

  removePhoto(index: number) {
    this.imageSrc.splice(index, 1);
    this.photos.splice(index, 1);
  }

  onSubmitPost() {
    if (!this.postForm.valid) { return; }
    const urlList: string[] = [];
    const timestamp = firebase.database.ServerValue.TIMESTAMP;
    let index = 0;
    let id: string;
    const today = getFormatedDate(new Date);
    let post: PostModel;
    if (this.photos && this.photos.length !== 0) {
      this.photos.forEach(
        file => {
          id = Math.random().toString(36).substring(2);
          urlList.push(`${today}/${index}-${id}`);
          this.userService.uploadPhoto(
            today,
            `${index}-${id}`, file);
          if (this.photos.length === index + 1) {
            post = new PostModel; {
              post.timestamp = timestamp;
              post.text = this.postForm.get(FormControlNames.POST).value;
              post.date = today;
              post.photos = urlList;
            }
            this.userService.addPost(post).then(() => {
              this.translate
                .get('alert.success.addPost')
                .pipe(takeUntil(this.destroy$))
                .subscribe(translation => {
                  this.alert.showNotification('success', translation);
                });
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
          index++;
        });
    } else {
      post = new PostModel; {
        post.timestamp = timestamp;
        post.text = this.postForm.get(FormControlNames.POST).value;
        post.date = today;
      }
      this.userService.addPost(post).then(() => {
        this.translate
          .get('alert.success.addPost')
          .pipe(takeUntil(this.destroy$))
          .subscribe(translation => {
            this.alert.showNotification('success', translation);
          });
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
    this.resetForm();
  }

  resetForm() {
    this.postForm.setValue({
      [FormControlNames.POST]: null
    });
    this.imageSrc = [];
    this.photos = [];

  }

}
