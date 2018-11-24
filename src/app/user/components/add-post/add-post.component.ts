import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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


  constructor(private formBuilder: FormBuilder) { }

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

  preview(file: File, i: number) {
    if (file) {
      const reader = new FileReader();
      reader.onload = a => this.imageSrc[i] = reader.result;
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



}
