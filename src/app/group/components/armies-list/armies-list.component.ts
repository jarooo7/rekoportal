import { Component, OnInit } from '@angular/core';
import { ArmyModel, standartArmy } from '../../models/army';
import { Router } from '@angular/router';
import { GropuService } from '../../services/gropu.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-armies-list',
  templateUrl: './armies-list.component.html',
  styleUrls: ['./armies-list.component.scss']
})
export class ArmiesListComponent implements OnInit {

  result: ArmyModel[] = [];

  constructor(
    private groupService: GropuService,
    private router: Router
  ) { }
  standartArmies: ArmyModel[];

  ngOnInit() {
    this.standartArmies = standartArmy;
    this.getOtherArmies();
  }

  goToArmy(name: string) {
    this.router.navigate(['/group/selected-groups/' + name]);
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
