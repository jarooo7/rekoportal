import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailActionComponent } from './components/email-action/email-action.component';



const routes: Routes = [
  { path: 'email-action', component: EmailActionComponent },
  {
    path: '',
    redirectTo: 'email-action',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailActionRouting { }
