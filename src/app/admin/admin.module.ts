import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminRouting } from './admin-routing.module';
import { ListUserComponent } from './components/list-user/list-user.component';
import { SugGroupsListComponent } from './components/sug-groups-list/sug-groups-list.component';
import { PreviewSugGroupComponent } from './components/preview-sug-group/preview-sug-group.component';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { PreviewGroupComponent } from './components/preview-group/preview-group.component';

@NgModule({
  imports: [
    SharedModule,
    AdminRouting
  ],
  declarations: [
  AdminPanelComponent,
  ListUserComponent,
  SugGroupsListComponent,
  PreviewSugGroupComponent,
  GroupsListComponent,
  PreviewGroupComponent],
  entryComponents: [
    PreviewSugGroupComponent,
    PreviewGroupComponent
  ]
})
export class AdminModule { }
