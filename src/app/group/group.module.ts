import { NgModule } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { PostsComponent } from './components/posts/posts.component';
import { GroupRouting } from './group-routing.module';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { AddGroupComponent } from './components/add-group/add-group.component';

@NgModule({
  imports: [
    SharedModule,
    GroupRouting,
    MatSelectModule
  ],
  declarations: [
    PostsComponent,
    GroupsListComponent,
    AddGroupComponent
  ],
  entryComponents: [
    AddGroupComponent
  ]
})
export class GroupModule { }
