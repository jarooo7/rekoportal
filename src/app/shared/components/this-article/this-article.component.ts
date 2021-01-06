import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SubArticleModel } from '../../../group/models/article';

@Component({
  selector: 'app-this-article',
  templateUrl: './this-article.component.html',
  styleUrls: ['./this-article.component.scss']
})
export class ThisArticleComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ThisArticleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubArticleModel
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {}

}
