import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserService } from '../../services/user.service';
import { PostIdModel } from '../../../shared/models/post.model';

@Component({
  selector: 'app-remove-post',
  templateUrl: './remove-post.component.html',
  styleUrls: ['./remove-post.component.scss']
})
export class RemovePostComponent  {

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<RemovePostComponent>,
    @Inject(MAT_DIALOG_DATA) public date: PostIdModel
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  remove() {
    this.userService.removePost(this.date.userId, this.date.id).then(
      () => {
        this.userService.removeLike(this.date.userId, this.date.id);
        this.userService.removeComPost(this.date.userId, this.date.id);
        if (this.date.date) {
          this.date.photos.forEach(p => {
            this.userService.removePhoto(this.date.userId, this.date.date, p);
          });
        }
        this.onNoClick();
      }
    );
  }

}
