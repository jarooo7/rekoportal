import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EmailActionComponent } from './components/email-action/email-action.component';
import { EmailActionRouting } from './email-action-routing.module';



@NgModule({
  imports: [
    SharedModule,
    EmailActionRouting
  ],
  declarations: [EmailActionComponent]
})
export class EmailActionModule { }
