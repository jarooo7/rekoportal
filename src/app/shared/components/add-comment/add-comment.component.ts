import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../user/services/user.service';

enum FormControlNames {
  COM = 'com'
}

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {

  @Input() userId: string;
  @Input() key: string;

  comForm: FormGroup;
  formControlNames = FormControlNames;
  openEmoji: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.openEmoji = false;
    this.comForm = this.formBuilder.group({
      [FormControlNames.COM]: ['', [Validators.required]]
    });
  }
  addEmoji($event) {
    const text = this.comForm.get(FormControlNames.COM).value;
    this.comForm.get(FormControlNames.COM).setValue(`${text}${$event.emoji.native}`);
    this.openEmoji = false;
  }

  openEmojiPopup() {
    this.openEmoji = !this.openEmoji;
  }

  closeEmojiPopup() {
    this.openEmoji = false;
  }

  onSubmit() {
    if (!this.comForm.valid) {return; }
    if (this.comForm.get(FormControlNames.COM).value === '\n') {
      this.resetForm();
      return;
    }
    this.userService.addCom(this.userId, this.key, this.comForm.get(FormControlNames.COM).value).then(
      () => this. resetForm());
  }
  resetForm() {
    this.comForm.setValue({
      [FormControlNames.COM]: null
    });
  }
}
