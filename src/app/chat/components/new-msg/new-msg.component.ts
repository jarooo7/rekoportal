import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { MsgModel } from '../../models/msg.model';


enum FormControlNames {
  MSG = 'msg'
}

@Component({
  selector: 'app-new-msg',
  templateUrl: './new-msg.component.html',
  styleUrls: ['./new-msg.component.scss']
})
export class NewMsgComponent implements OnInit {
  @Input() msgId: string;
  @Input() userId: string;

  msgForm: FormGroup;
  formControlNames = FormControlNames;
  openEmoji: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.openEmoji = false;
    this.msgForm = this.formBuilder.group({
      [FormControlNames.MSG]: ['', [Validators.required]]
    });
  }
  addEmoji($event) {
    const text = this.msgForm.get(FormControlNames.MSG).value;
    this.msgForm.get(FormControlNames.MSG).setValue(`${text}${$event.emoji.native}`);
    this.openEmoji = false;
  }

  openEmojiPopup() {
    this.openEmoji = !this.openEmoji;
  }

  closeEmojiPopup() {
    this.openEmoji = false;
  }

  readOut() {
    this.chatService.readOut(this.msgId);
  }

  onSubmit() {
    this.readOut();
    if (!this.msgForm.valid) {
      return; }
    if (this.msgForm.get(FormControlNames.MSG).value === '\n') {
      this.resetForm();
      return;
    }
    this.chatService.sentMsg(this.msgId, this.msgForm.get(FormControlNames.MSG).value).then(
      () => {
        this. resetForm();
        this.chatService.newMsg(this.userId, this.msgId);
      });
  }
  resetForm() {
    this.msgForm.setValue({
      [FormControlNames.MSG]: null
    });
  }

}
