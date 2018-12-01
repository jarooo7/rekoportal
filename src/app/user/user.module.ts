import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserRouting } from './user-routing.module';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { GalleryComponent } from '../shared/components/gallery/gallery.component';
import { LikeComponent } from '../shared/components/like/like.component';
import { AddCommentComponent } from '../shared/components/add-comment/add-comment.component';
import { ViewCommentComponent } from '../shared/components/view-comment/view-comment.component';
import { CommentComponent } from '../shared/components/comment/comment.component';



@NgModule({
  imports: [
    SharedModule,
    UserRouting
  ],
  declarations: [
    CompleteProfileComponent,
    ProfileComponent,
    AddPostComponent,
    PostListComponent,
    GalleryComponent,
    LikeComponent,
    AddCommentComponent,
    ViewCommentComponent,
    CommentComponent
  ]
})
export class UserModule { }
