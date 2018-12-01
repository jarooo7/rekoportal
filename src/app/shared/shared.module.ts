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
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {AngularFireStorageModule} from 'angularfire2/storage';
import { FileDropDirective } from './directives/file-drop.directive' ;
import { Ng2ImgToolsModule } from 'ng2-img-tools';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
const MODULES = [
  PickerModule,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule,
  NotifierModule,
  AngularFirestoreModule,
  AngularFireAuthModule,
  AngularFireDatabaseModule,
  AngularFontAwesomeModule,
  AngularFireStorageModule,
  Ng2ImgToolsModule,
  InfiniteScrollModule
];

const DIRECTIVES = [
  ErrorDirectiveDirective,
  FileDropDirective
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
    ...COMPONENTS,
    FileDropDirective
  ],
  exports: [
    ...MODULES,
    ...DIRECTIVES,
    ...COMPONENTS
  ]
})
export class SharedModule { }
