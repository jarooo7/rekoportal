import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { PostModel } from '../../../shared/models/post.model';
import { getFormatedDate } from '../../../shared/functions/format-date';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';
import { TranslateService } from '@ngx-translate/core';


enum FormControlNames {
  POST = 'post'
}

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})

export class AddPostComponent implements OnInit {

  @Output() addNewPost = new EventEmitter();

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

  private addPost(): void {
    this.addNewPost.emit();
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

  onSubmitPost() {
    if (!this.postForm.valid) { return; }
    const urlList: string[] = [];
    const timestamp = this.userService.time();
    let index = 0;
    let index2 = 0;
    let id: string;
    const today = getFormatedDate(new Date);
    let post: PostModel;
    if (this.photos && this.photos.length !== 0) {
      this.photos.forEach(
        file => {
          id = Math.random().toString(36).substring(2);
          this.userService.uploadPhoto(
            today,
            `${index}-${id}`, file).then(p => {
              p.ref.getDownloadURL().then(
                url => {
                  urlList.push(url);
                  if (this.photos.length === index2 + 1) {
                    post = new PostModel; {
                      post.timestamp = timestamp;
                      post.text = this.postForm.get(FormControlNames.POST).value;
                      post.date = today;
                      post.userId = this.userService.userId;
                      post.photos = urlList;
                    }
                    this.userService.addPost(post).then(() => {
                      this.translate
                        .get('alert.success.addPost')
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(translation => {
                          this.alert.showNotification('success', translation);
                        });
                        this.resetForm();
                        this.addPost();
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
      post = new PostModel; {
        post.timestamp = timestamp;
        post.userId = this.userService.userId;
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
          this.resetForm();
          this.addPost();
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

  resetForm() {
    this.postForm.setValue({
      [FormControlNames.POST]: null
    });
    this.imageSrc = [];
    this.photos = [];

  }

}
