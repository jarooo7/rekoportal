import { Component, OnInit } from '@angular/core';
import { ArmyModel, standartArmy } from '../../models/army';

@Component({
  selector: 'app-armies-list',
  templateUrl: './armies-list.component.html',
  styleUrls: ['./armies-list.component.scss']
})
export class ArmiesListComponent implements OnInit {

  constructor() { }
  standartArmies: ArmyModel[];

  ngOnInit() {
    this.standartArmies = standartArmy;
  }

}
