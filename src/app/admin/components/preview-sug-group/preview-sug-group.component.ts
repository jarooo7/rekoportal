import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SugGroupModel } from '../../../group/models/suggestionGroup';
import { ArmyModel } from '../../../group/models/army';
import { AdminService } from '../../services/admin.service';
import { GroupModel} from '../../../group/models/group';
import { getFormatedSearch } from '../../../shared/functions/format-search-text';

@Component({
  selector: 'app-preview-sug-group',
  templateUrl: './preview-sug-group.component.html',
  styleUrls: ['./preview-sug-group.component.scss']
})
export class PreviewSugGroupComponent implements OnInit {

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
  standartLoadArmies: ArmyModel[] = [];
  newArmies: ArmyModel[] = [];


  constructor(
    private adminService: AdminService,
    public dialogRef: MatDialogRef<PreviewSugGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public sug: SugGroupModel) {}


  ngOnInit() {
    this.selectArmies();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectArmies() {
    let flag: boolean;
    this.sug.armies.forEach(e => {
      flag = false;
      this.standartArmy.forEach(s => {
        if (e === s.name) {
          flag = true;
        }
      });
      if (flag) {
        this.standartLoadArmies.push({name: e, isChecked: true});
      } else {
        this.newArmies.push({name: e, isChecked: true});
      }
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
        this.sug.armies.forEach(e => {
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
