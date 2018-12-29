import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { EpochModel, standartEpoch } from '../../models/epoch';
import { GropuService } from '../../services/gropu.service';
import { SugGroupModel } from '../../models/suggestionGroup';
import { GroupModule } from '../../group.module';

enum FormControlNames {
  DESCRIPTION = 'description',
  NAME = 'name',
  EPOCHS= 'epochs'
}

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})

export class AddGroupComponent implements OnInit {

  groupForm: FormGroup;
  addEpoch = new FormControl ();
  sugGroup: SugGroupModel;
  formControlNames = FormControlNames;
  newEpochs: EpochModel[] = [];
  standartEpoch: EpochModel[] = [
    {name: 'WWI' },
    {name: 'WWII' },
    {name: 'polishBolshevik' },
    {name: '1939' },
    {name: 'antiquity' },
    {name: 'middleAges' },
    {name: 'IRP' },
    {name: 'napoleon' },
    {name: 'november' },
    {name: 'january' },
    {name: 'civilWar' },
    {name: 'warsaw44' },
    {name: 'presentDay' }
];
  constructor(
    private grupService: GropuService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddGroupComponent>) {}
  ngOnInit() {
    this.groupForm = this.formBuilder.group({
      [FormControlNames.NAME]: ['', [Validators.required]],
      [FormControlNames.DESCRIPTION]: ['', [Validators.required]],
      [FormControlNames.EPOCHS]: [''],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    this.sugGroup = new SugGroupModel(); {
      this.sugGroup.userId = this.grupService.userId;
      this.sugGroup.name = this.groupForm.value[FormControlNames.NAME];
      this.sugGroup.description = this.groupForm.value[FormControlNames.DESCRIPTION];
      this.sugGroup.epochs = this.groupForm.value[FormControlNames.EPOCHS] as string[];
    }
    this.grupService.addSuggestionGroup(this.sugGroup).then(() => {
      this.onNoClick();
    });
  }
  addNewEpoch() {
    let e: EpochModel;
    e = new EpochModel(); {
      e.name = this.addEpoch.value;
    }
    this.newEpochs.push(e);
  }
}
