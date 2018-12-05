import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SearchRouting } from './search-routing.module';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { UserResultComponent } from './components/user-result/user-result.component';


@NgModule({
  imports: [
    SharedModule,
    SearchRouting
  ],
  declarations: [
    SearchResultsComponent
  ]
})
export class SearchModule { }
