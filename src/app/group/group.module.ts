import { NgModule } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { PostsComponent } from './components/posts/posts.component';
import { GroupRouting } from './group-routing.module';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { GroupProfileComponent } from './components/group-profile/group-profile.component';
import { AddArticleComponent } from './components/add-article/add-article.component';
import { GroupInfoComponent } from './components/group-info/group-info.component';
import { ArticleComponent } from './components/article/article.component';
import { GroupNavComponent } from './components/group-nav/group-nav.component';

@NgModule({
  imports: [
    SharedModule,
    GroupRouting,
    MatSelectModule
  ],
  declarations: [
    PostsComponent,
    GroupsListComponent,
    AddGroupComponent,
    GroupProfileComponent,
    AddArticleComponent,
    GroupInfoComponent,
    ArticleComponent,
    GroupNavComponent
  ],
  entryComponents: [
    AddGroupComponent,
    AddArticleComponent
  ]
})
export class GroupModule { }
