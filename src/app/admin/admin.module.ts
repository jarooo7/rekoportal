import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminRouting } from './admin-routing.module';
import { ListUserComponent } from './components/list-user/list-user.component';
import { SugGroupsListComponent } from './components/sug-groups-list/sug-groups-list.component';
import { UserResComponent } from './components/user-res/user-res.component';
import { PreviewSugGroupComponent } from './components/preview-sug-group/preview-sug-group.component';
import { GroupsListComponent } from './components/groups-list/groups-list.component';



@NgModule({
  imports: [
    SharedModule,
    AdminRouting
  ],
  declarations: [
  AdminPanelComponent,
  ListUserComponent,
  SugGroupsListComponent,
  UserResComponent,
  PreviewSugGroupComponent,
  GroupsListComponent],
  entryComponents: [
    PreviewSugGroupComponent
  ]
})
export class AdminModule { }
