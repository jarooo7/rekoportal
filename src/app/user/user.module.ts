import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserRouting } from './user-routing.module';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';



@NgModule({
  imports: [
    SharedModule,
    UserRouting
  ],
  declarations: [CompleteProfileComponent]
})
export class UserModule { }
