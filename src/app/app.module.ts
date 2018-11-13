import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './core/components/app/app.component';
import { CoreModule } from './core/core.modules';


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CoreModule.forRoot(),
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
