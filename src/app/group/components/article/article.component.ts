import { Component, Input} from '@angular/core';
import { GropuService } from '../../services/gropu.service';
import { map } from 'rxjs/operators';
import { ArticleModel } from '../../models/article';
import { group } from '@angular/animations';
import { GroupModel } from '../../models/group';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent  {
  @Input() set id(id: string) {
    this.articleId = id;
    this.loadGroup(id);
  }
  @Input() group;
  article: ArticleModel;
  articleId: string;


  constructor(private groupService: GropuService) { }

  loadGroup(id: string) {
    this.groupService.getThisArticle(id).pipe(
      map(article => ({ key: article.payload.key, ...article.payload.val() })
      )
    ).subscribe(res => {
      this.article = res;
    });
  }

}
