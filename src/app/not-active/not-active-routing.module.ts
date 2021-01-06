import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotActiveComponent } from './components/not-active/not-active.component';


const routes: Routes = [
  { path: 'not-active', component: NotActiveComponent },
  {
    path: '',
    redirectTo: 'not-active',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotActiveRouting { }
