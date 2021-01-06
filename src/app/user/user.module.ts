import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserRouting } from './user-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { RemovePostComponent } from './components/remove-post/remove-post.component';



@NgModule({
  imports: [
    SharedModule,
    UserRouting
  ],
  declarations: [
    ProfileComponent,
    PostListComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    EditPostComponent,
    RemovePostComponent
  ],
  entryComponents: [EditProfileComponent,
    ChangePasswordComponent,
    EditPostComponent,
    RemovePostComponent]
})
export class UserModule { }
