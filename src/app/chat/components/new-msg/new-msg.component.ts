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

  onSubmit() {
    if (!this.msgForm.valid) {return; }
    this.chatService.sentMsg(this.msgId, this.msgForm.get(FormControlNames.MSG).value).then(
      () => this. resetForm());
  }
  resetForm() {
    this.msgForm.setValue({
      [FormControlNames.MSG]: null
    });
  }

}
