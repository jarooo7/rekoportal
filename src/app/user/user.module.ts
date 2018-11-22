import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserRouting } from './user-routing.module';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddPostComponent } from './components/add-post/add-post.component';



@NgModule({
  imports: [
    SharedModule,
    UserRouting
  ],
  declarations: [CompleteProfileComponent, ProfileComponent, AddPostComponent]
})
export class UserModule { }
