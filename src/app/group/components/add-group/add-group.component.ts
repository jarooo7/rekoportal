import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ArmyModel, standartArmy } from '../../models/army';
import { GropuService } from '../../services/gropu.service';
import { SugGroupModel } from '../../models/suggestionGroup';
import { GroupModule } from '../../group.module';

enum FormControlNames {
  DESCRIPTION = 'description',
  NAME = 'name',
  ARMIES= 'armies'
}

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})

export class AddGroupComponent implements OnInit {

  groupForm: FormGroup;
  addArmy = new FormControl ();
  sugGroup: SugGroupModel;
  formControlNames = FormControlNames;
  newArmies: ArmyModel[] = [];
  standartArmy: ArmyModel[] = [
    {name: 'WWI' },
    {name: 'WWII' },
    {name: 'polishBolshevik' },
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
      [FormControlNames.ARMIES]: [''],
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
      this.sugGroup.armies = this.groupForm.value[FormControlNames.ARMIES] as string[];
    }
    this.grupService.addSuggestionGroup(this.sugGroup).then(() => {
      this.onNoClick();
    });
  }
  addNewArmy() {
    let e: ArmyModel;
    e = new ArmyModel(); {
      e.name = this.addArmy.value;
    }
    this.newArmies.push(e);
  }
}
