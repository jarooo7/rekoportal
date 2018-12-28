import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PostsComponent } from './components/posts/posts.component';
import { GroupRouting } from './group-routing.module';
import { GroupsListComponent } from './components/groups-list/groups-list.component';




@NgModule({
  imports: [
    SharedModule,
    GroupRouting
  ],
  declarations: [
    PostsComponent,
    GroupsListComponent
  ]
})
export class GroupModule { }
