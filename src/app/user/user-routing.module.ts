import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { ProfileComponent } from './components/profile/profile.component';



const routes: Routes = [
  { path: 'complete-profile', component: CompleteProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:idUser', component: ProfileComponent },
  {
    path: '',
    redirectTo: 'complete-profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRouting { }
