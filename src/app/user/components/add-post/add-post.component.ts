import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {

  imageSrc: string[] = [];

  isHovering: boolean;

  constructor() { }


  ngOnInit() {
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
      }
    });
  }

  removePhoto(index: number) {
    this.imageSrc.splice(index, 1);
  }


}
