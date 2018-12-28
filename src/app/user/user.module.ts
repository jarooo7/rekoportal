import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserRouting } from './user-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { PostListComponent } from './components/post-list/post-list.component';



@NgModule({
  imports: [
    SharedModule,
    UserRouting
  ],
  declarations: [
    ProfileComponent,
    PostListComponent
  ]
})
export class UserModule { }
