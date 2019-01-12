import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ArmyModel, standartArmy } from '../../models/army';
import { GropuService } from '../../services/gropu.service';
import { SugGroupModel } from '../../models/suggestionGroup';
import { GroupModule } from '../../group.module';
import { map } from 'rxjs/operators';

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
  result: ArmyModel[] = [];
  standartArmy: ArmyModel[] = [
    {name: 'rusEmpire'},
    {name: 'ausHung'},
    {name: 'prussian'},
    {name: 'hussars'},
    {name: 'redArmy'},
    {name: 'wehrmacht'},
    {name: 'bolsheviks'},
    {name: 'january'},
    {name: 'november'},
    {name: 'greatArmy'},
    {name: 'knighthood'},
    {name: 'greek'},
    {name: 'roman'},
    {name: 'templar'},
    {name: 'teutonic'},
    {name: 'polLegions'}
];
  constructor(
    private groupService: GropuService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddGroupComponent>) {}
  ngOnInit() {
    this.getOtherArmies();
    this.groupForm = this.formBuilder.group({
      [FormControlNames.NAME]: ['', [Validators.required, Validators.maxLength(100)]],
      [FormControlNames.DESCRIPTION]: ['', [Validators.required, Validators.maxLength(1500)]],
      [FormControlNames.ARMIES]: [''],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    this.sugGroup = new SugGroupModel(); {
      this.sugGroup.userId = this.groupService.userId;
      this.sugGroup.name = this.groupForm.value[FormControlNames.NAME];
      this.sugGroup.description = this.groupForm.value[FormControlNames.DESCRIPTION];
      this.sugGroup.armies = this.groupForm.value[FormControlNames.ARMIES] as string[];
    }
    this.groupService.addSuggestionGroup(this.sugGroup).then(() => {
      this.onNoClick();
    });
  }
  addNewArmy() {
    let e: ArmyModel;
    e = new ArmyModel(); {
      e.name = this.addArmy.value;
    }
    this.newArmies.push(e);
    this.addArmy = new FormControl ();
  }
  getOtherArmies() {
    this.groupService.getOtherArmies().pipe(
      map(sug =>
        sug.map(u => ({ key: u.payload.key, ...u.payload.val() }))
      )
    ).subscribe(result => {
      this.result = result;
    });
  }
}
