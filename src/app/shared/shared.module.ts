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
import { AngularFireStorageModule } from 'angularfire2/storage';
import { FileDropDirective } from './directives/file-drop.directive';
import { Ng2ImgToolsModule } from 'ng2-img-tools';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MatButtonModule, MatCheckboxModule, MatDialogModule } from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UserResultComponent } from '../search/components/user-result/user-result.component';
import { FriendsListComponent } from '../chat/components/friends-list/friends-list.component';
import { ContactsComponent } from '../chat/components/contacts/contacts.component';
import { WindowChatComponent } from '../chat/components/window-chat/window-chat.component';
import { NewMsgComponent } from '../chat/components/new-msg/new-msg.component';
import { AddPostComponent } from '../user/components/add-post/add-post.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { LikeComponent } from './components/like/like.component';
import { ViewCommentComponent } from './components/view-comment/view-comment.component';
import { CommentComponent } from './components/comment/comment.component';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { FilterUserPipe } from './pipe/filter-user.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import { GroupResComponent } from '../group/components/group-res/group-res.component';
import { UserResComponent } from '../admin/components/user-res/user-res.component';
import { AdminGroupComponent } from '../group/components/admin-group/admin-group.component';

const MODULES = [
  MatInputModule,
  PickerModule,
  CommonModule,
  FormsModule,
  MatIconModule,
  ReactiveFormsModule,
  TranslateModule,
  NotifierModule,
  MatButtonModule,
  MatTabsModule,
  MatExpansionModule,
  MatBadgeModule,
  MatCheckboxModule,
  AngularFirestoreModule,
  AngularFireAuthModule,
  AngularFireDatabaseModule,
  AngularFontAwesomeModule,
  AngularFireStorageModule,
  MatDialogModule,
  MatMenuModule,
  Ng2ImgToolsModule,
  InfiniteScrollModule
];

const DIRECTIVES = [
  ErrorDirectiveDirective,
  FileDropDirective,
  FilterUserPipe
];


const COMPONENTS = [
  GroupResComponent,
  AdminGroupComponent,
  UserResultComponent,
  FriendsListComponent,
  ContactsComponent,
  WindowChatComponent,
  AddPostComponent,
  NewMsgComponent,
  GalleryComponent,
  LikeComponent,
  ViewCommentComponent,
  CommentComponent,
  AddCommentComponent,
  UserResComponent
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
  ],
  entryComponents: [AdminGroupComponent]
})
export class SharedModule { }
