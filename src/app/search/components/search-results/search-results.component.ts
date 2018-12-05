import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SearchResultsService } from '../../services/search-results.service';
import { UserModel } from '../../../user/models/profile.model';
import { getFormatedSearch } from '../../../shared/functions/format-search-text';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  result: UserModel[] = [];
  isSmall = false;

  textSearch: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchResultsService
  ) { }

  ngOnInit() {
    this.readRouting();
  }
  readRouting() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.textSearch = getFormatedSearch(params['search']);
      this.search();
    });
  }

  search() {
    if (this.textSearch.length < 3) {
      this.isSmall = true;
      this.result = [];
      return;
    }
    this.isSmall = false;
    this.searchService.getUser(this.textSearch ,  this.textSearch + '\uf8ff')
    .pipe(
      map(like =>
        like.map( l => ({ key: l.payload.key, ...l.payload.val() }))
      ))
    .subscribe(u => {
      this.result = u;
    });
  }
}
