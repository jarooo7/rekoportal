import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TablePostRouting } from './table-post-routing.module';
import { PostsComponent } from './components/posts/posts.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostComponent } from './components/post/post.component';




@NgModule({
    imports: [
        SharedModule,
        TablePostRouting
    ],
    declarations: [
        PostsComponent,
        PostListComponent,
        PostComponent]
})
export class TablePostModule { }
