import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NotifierModule } from 'angular-notifier';
import { ErrorDirectiveDirective } from './directives/error-directive.directive';
import { environment } from '../../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';


const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule,
  NotifierModule,
  AngularFirestoreModule,
  AngularFireAuthModule,
  AngularFireDatabaseModule,
];

const DIRECTIVES = [
  ErrorDirectiveDirective
];

const COMPONENTS = [

];

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    ...MODULES
  ],
  declarations: [
    ...DIRECTIVES,
    ...COMPONENTS
  ],
  exports: [
    ...MODULES,
    ...DIRECTIVES,
    ...COMPONENTS
  ]
})
export class SharedModule { }
