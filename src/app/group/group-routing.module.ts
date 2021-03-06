import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsComponent } from './components/posts/posts.component';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { GroupProfileComponent } from './components/group-profile/group-profile.component';
import { ArmiesListComponent } from './components/armies-list/armies-list.component';
import { SelectedGroupsComponent } from './components/selected-groups/selected-groups.component';

const routes: Routes = [
  { path: 'group', component: GroupProfileComponent },
  { path: 'group/:id', component: GroupProfileComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'groups-list', component: GroupsListComponent },
  { path: 'selected-groups', component: SelectedGroupsComponent },
  { path: 'selected-groups/:name', component: SelectedGroupsComponent },
  { path: 'armies', component: ArmiesListComponent },
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRouting { }
