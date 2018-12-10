import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminRouting } from './admin-routing.module';
import { ListUserComponent } from './components/list-user/list-user.component';



@NgModule({
  imports: [
    SharedModule,
    AdminRouting
  ],
  declarations: [
  AdminPanelComponent,
  ListUserComponent]
})
export class AdminModule { }
