import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserRouting } from './user-routing.module';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostListComponent } from './components/post-list/post-list.component';



@NgModule({
  imports: [
    SharedModule,
    UserRouting
  ],
  declarations: [
    CompleteProfileComponent,
    ProfileComponent,
    PostListComponent
  ]
})
export class UserModule { }
