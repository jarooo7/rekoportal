import { Component, OnInit } from '@angular/core';
import { GropuService } from '../../services/gropu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { GroupModel } from '../../models/group';

@Component({
  selector: 'app-selected-groups',
  templateUrl: './selected-groups.component.html',
  styleUrls: ['./selected-groups.component.scss']
})
export class SelectedGroupsComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  army: string;
  result: GroupModel[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GropuService,
  ) { }

  ngOnInit() {
    this.readRouting();
  }
  readRouting() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.army = null;
      this.army = params['name'];
      this.loadRouting();
    });
  }

  loadRouting() {
    if (!this.army) {
      this.router.navigate(['/group/groups-list']);
    } else {
      this.getGroups(this.army);
    }
  }
  getGroups(army: string) {
    this.groupService.getGroups(army).pipe(
      map(sug =>
        sug.map(u => ({ key: u.payload.key, ...u.payload.val() }))
      )
    ).subscribe(result => {
      this.result = result;
    });
  }

}
