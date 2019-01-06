import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SugGroupModel } from '../../../group/models/suggestionGroup';
import { EpochModel } from '../../../group/models/epoch';
import { AdminService } from '../../services/admin.service';
import { GroupModel} from '../../../group/models/group';
import { getFormatedSearch } from '../../../shared/functions/format-search-text';

@Component({
  selector: 'app-preview-sug-group',
  templateUrl: './preview-sug-group.component.html',
  styleUrls: ['./preview-sug-group.component.scss']
})
export class PreviewSugGroupComponent implements OnInit {

  standartEpoch: EpochModel[] = [
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
  standartLoadEpoches: EpochModel[] = [];
  newEpoches: EpochModel[] = [];


  constructor(
    private adminService: AdminService,
    public dialogRef: MatDialogRef<PreviewSugGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public sug: SugGroupModel) {}


  ngOnInit() {
    this.selectEpochs();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectEpochs() {
    let flag: boolean;
    this.sug.epochs.forEach(e => {
      flag = false;
      this.standartEpoch.forEach(s => {
        if (e === s.name) {
          flag = true;
        }
      });
      if (flag) {
        this.standartLoadEpoches.push({name: e, isChecked: true});
      } else {
        this.newEpoches.push({name: e, isChecked: true});
      }
    });
  }

  onSubmit() {
    this.newEpoches.forEach(
      e => {
        if (e.isChecked) {
          this.addNewEpochs(e.name);
        }
      }
    );
    let group: GroupModel;
    group = new GroupModel(); {
      group.name = this.sug.name;
      group.description = this.sug.description;
      group.epochs = this.selectStandartEpochs();
      group.otherEpochs = this.selectOtherEpochs();
      group.admins = [];
      group.search = getFormatedSearch(this.sug.name.toLowerCase());
      group.admins.push(this.sug.userId);
    }
    this.adminService.addNewGroup(group).then(
      a => {
        this.sug.epochs.forEach(e => {
          this.addEpochs(a.key, e);
        });
      }
    );
    this.remSug();
  }

  selectStandartEpochs(): string[] {
    const epochs: string[] = [];
    this.standartLoadEpoches.forEach(
      e => {
        if (e.isChecked) {
          epochs.push(e.name);
        }
      }
    );
    return epochs;
  }
  selectOtherEpochs(): string[] {
    const epochs: string[] = [];
    this.newEpoches.forEach(
      e => {
        if (e.isChecked) {
          epochs.push(e.name);
        }
      }
    );
    return epochs;
  }

  addNewEpochs(e: string) {
    this.adminService.addNewEpoch({name: e});
  }

  addEpochs(key: string, e: string) {
    this.adminService.groupInEpoch(key, e);
  }

  remSug() {
    this.adminService.removeSuggestionGroup(this.sug.key);
    this.onNoClick();
  }
}
