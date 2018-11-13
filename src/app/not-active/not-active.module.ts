import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NotActiveComponent } from './components/not-active/not-active.component';
import { NotActiveRouting } from './not-active-routing.module';


@NgModule({
  imports: [
    SharedModule,
    NotActiveRouting
  ],
  declarations: [NotActiveComponent]
})
export class NotActiveModule { }
