import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  @Input() set image(images: string[]) {
    this.images = images;
    this.index = 0 ;
    this.startGallery(images);
  }
  images: string[];
  classImg: string[] = [];
  index: number;

  constructor() { }

  ngOnInit() {
  }
  startGallery(img: string[]) {
    let one = true;
    img.forEach(() => {
      if (one) {
        this.classImg.push('active');
        one = false;
      } else {
        this.classImg.push('');
      }
    }
  );
  }
  next() {
    this.index = (this.index + 1) % this.classImg.length;
    for (let i = 0; i < this.classImg.length; i++ ) {
      if (this.index === i) {
        this.classImg[i] = 'active';
        } else {
        this.classImg[i] = '';
      }
    }
  }

  prev() {
    if (this.index === 0) {
      this.index = this.classImg.length - 1;
    } else {
      this.index = (this.index - 1) % this.classImg.length;
    }
    for (let i = 0; i < this.classImg.length; i++ ) {
      if (this.index === i) {
        this.classImg[i] = 'active';
        } else {
        this.classImg[i] = '';
      }
    }
  }

}
