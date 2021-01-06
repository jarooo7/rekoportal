import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserModel } from '../../models/profile.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../services/user.service';
import { getFormatedSearch } from '../../../shared/functions/format-search-text';

enum FormControlNames {
  LAST_NAME = 'lastName',
  NAME = 'name'
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  profileForm: FormGroup;
  formControlNames = FormControlNames;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UserModel>,
    @Inject(MAT_DIALOG_DATA) public user: UserModel
  ) {}
  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      [FormControlNames.NAME]: ['', [Validators.required, Validators.maxLength(100)]],
      [FormControlNames.LAST_NAME]: ['', [Validators.required, Validators.maxLength(100)]]
    });
    this.setFormValue();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setFormValue() {
    this.profileForm.setValue({
      [FormControlNames.NAME]: this.user.name,
      [FormControlNames.LAST_NAME]: this.user.lastName
    });
  }

  onSubmit() {
    const textSearch = `${this.profileForm.get(FormControlNames.NAME).value} ${this.profileForm.get(FormControlNames.LAST_NAME).value}`;
    this.userService.editUser(this.user.key,
       this.profileForm.value[FormControlNames.NAME],
       this.profileForm.value[FormControlNames.LAST_NAME],
       getFormatedSearch(textSearch.toLowerCase())
      );
      this.onNoClick();
  }

}
