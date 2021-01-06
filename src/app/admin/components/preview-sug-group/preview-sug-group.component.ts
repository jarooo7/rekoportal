import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SugGroupModel } from '../../../group/models/suggestionGroup';
import { ArmyModel } from '../../../group/models/army';
import { AdminService } from '../../services/admin.service';
import { GroupModel} from '../../../group/models/group';
import { getFormatedSearch } from '../../../shared/functions/format-search-text';
import { GropuService } from '../../../group/services/gropu.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-preview-sug-group',
  templateUrl: './preview-sug-group.component.html',
  styleUrls: ['./preview-sug-group.component.scss']
})
export class PreviewSugGroupComponent implements OnInit {

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
  armies: string[] = [];
  result: ArmyModel[] = [];
  standartLoadArmies: ArmyModel[] = [];
  newArmies: ArmyModel[] = [];
  otherArmies: ArmyModel[] = [];


  constructor(
    private groupService: GropuService,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<PreviewSugGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public sug: SugGroupModel) {}


  ngOnInit() {
    this.getOtherArmies();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectArmies() {
    let flag: boolean;
    let flag2: boolean;
    this.sug.armies.forEach(e => {
      flag = false;
      flag2 = false;
      this.standartArmy.forEach(s => {
        if (e === s.name) {
          flag = true;
        }
      });
      this.result.forEach(s => {
        if (e === s.name) {
          flag2 = true;
        }
      });
      if (flag) {
        this.standartLoadArmies.push({name: e, isChecked: true});
      }
      if (flag2) {
        this.otherArmies.push({name: e, isChecked: true});
      }
      if (!flag && !flag2) {
        this.newArmies.push({name: e, isChecked: true});
      }
    });
  }

  getOtherArmies() {
    this.groupService.getOtherArmies().pipe(
      map(sug =>
        sug.map(u => ({ key: u.payload.key, ...u.payload.val() }))
      )
    ).subscribe(result => {
      this.result = result;
      this.selectArmies();
    });
  }

  onSubmit() {
    this.newArmies.forEach(
      e => {
        if (e.isChecked) {
          this.addNewArmies(e.name);
        }
      }
    );
    let group: GroupModel;
    group = new GroupModel(); {
      group.name = this.sug.name;
      group.description = this.sug.description;
      group.armies = this.selectStandartArmies();
      group.otherArmies = this.selectOtherArmies();
      group.admins = [];
      group.search = getFormatedSearch(this.sug.name.toLowerCase());
      group.admins.push(this.sug.userId);
    }
    this.adminService.addNewGroup(group).then(
      a => {
        this.armies.forEach(e => {
          this.addArmies(a.key, e);
        });
      }
    );
    this.remSug();
  }

  selectStandartArmies(): string[] {
    const armies: string[] = [];
    this.standartLoadArmies.forEach(
      e => {
        if (e.isChecked) {
          armies.push(e.name);
        }
      }
    );
    this.armies = this.armies.concat(armies);
    return armies;
  }
  selectOtherArmies(): string[] {
    const armies: string[] = [];
    this.newArmies.forEach(
      e => {
        if (e.isChecked) {
          armies.push(e.name);
        }
      }
    );
    this.armies = this.armies.concat(armies);
    this.otherArmies.forEach(
      e => {
        if (e.isChecked) {
          armies.push(e.name);
        }
      }
    );
    this.armies = this.armies.concat(armies);
    return armies;
  }

  addNewArmies(e: string) {
    this.adminService.addNewArmy({name: e});
  }

  addArmies(key: string, e: string) {
    this.adminService.groupInArmy(key, e);
  }

  remSug() {
    this.adminService.removeSuggestionGroup(this.sug.key);
    this.onNoClick();
  }
}
