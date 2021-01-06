import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchResultsComponent } from './components/search-results/search-results.component';


const routes: Routes = [
  { path: 'result-search', component: SearchResultsComponent },
  { path: 'result-search/:search', component: SearchResultsComponent},
  {
    path: '',
    redirectTo: 'result-search',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRouting { }
