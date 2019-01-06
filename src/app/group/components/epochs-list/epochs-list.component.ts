import { Component, OnInit } from '@angular/core';
import { EpochModel, standartEpoch } from '../../models/epoch';

@Component({
  selector: 'app-epochs-list',
  templateUrl: './epochs-list.component.html',
  styleUrls: ['./epochs-list.component.scss']
})
export class EpochsListComponent implements OnInit {

  constructor() { }
  standartEpochs: EpochModel[];

  ngOnInit() {
    this.standartEpochs = standartEpoch;
  }

}
