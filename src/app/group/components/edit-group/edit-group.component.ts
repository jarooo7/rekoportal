import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupModel } from '../../models/group';
import { GropuService } from '../../services/gropu.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

enum FormControlNames {
  DESCRIPTION = 'description',
  NAME = 'name'
}
@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {

  groupForm: FormGroup;
  editGroup: GroupModel;
  formControlNames = FormControlNames;

  constructor(
    private groupService: GropuService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public group: GroupModel
  ) {}
  ngOnInit() {
    this.groupForm = this.formBuilder.group({
      [FormControlNames.NAME]: ['', [Validators.required]],
      [FormControlNames.DESCRIPTION]: ['', [Validators.required]]
    });
    this.setFormValue();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setFormValue() {
    this.groupForm.setValue({
      [FormControlNames.NAME]: this.group.name,
      [FormControlNames.DESCRIPTION]: this.group.description
    });
  }

  onSubmit() {
    this.groupService.editGroup(this.group.key,
       this.groupForm.value[FormControlNames.NAME],
       this.groupForm.value[FormControlNames.DESCRIPTION]
      );
      this.onNoClick();
  }

}
