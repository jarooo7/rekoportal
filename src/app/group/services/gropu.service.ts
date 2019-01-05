import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AuthService } from '../../auth/services/auth.service';
import { SugGroupModel } from '../models/suggestionGroup';
import { GroupModel } from '../models/group';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from 'angularfire2/storage';
import { ArticleModel, ArticleLocationModel } from '../models/article';

@Injectable({
  providedIn: 'root'
})
export class GropuService {

  userId: string;

  constructor(
    private dataBase: AngularFireDatabase,
    private authService: AuthService,
    private afStorage: AngularFireStorage
  ) {
      this.authService.authState$.subscribe(user => {
        if (user) {
          this.userId = user.uid;
        }
      });
    }

    addSuggestionGroup(sug: SugGroupModel) {
      const gr: AngularFireList<SugGroupModel> = this.dataBase.list('sugGroup');
      return gr.push(sug);
    }

    getGroup(id) {
      const gr: AngularFireObject<GroupModel> = this.dataBase.object(`group/${id}`);
      return gr.snapshotChanges();
    }

    getArticle(id: string, batch: number, lastKey?: string) {
      let article: AngularFireList<ArticleLocationModel> = null;
      if (lastKey) {
        article = this.dataBase.list(`articleLocation/${id}`, ref => ref.orderByChild('timestamp').limitToLast(batch).endAt(lastKey));
      } else {
        article = this.dataBase.list(`articleLocation/${id}`, ref => ref.orderByChild('timestamp').limitToLast(batch));
      }
      return article.snapshotChanges();
    }

    getThisArticle(id: string) {
      const gr: AngularFireObject<ArticleModel> = this.dataBase.object(`article/${id}`);
      return gr.snapshotChanges();
    }

    getGlobalArticle(batch: number, lastKey?: string) {
      let article: AngularFireList<ArticleModel> = null;
      if (lastKey) {
        article = this.dataBase.list('article', ref => ref.orderByChild('timestamp').limitToLast(batch).endAt(lastKey));
      } else {
        article = this.dataBase.list('article', ref => ref.orderByChild('timestamp').limitToLast(batch));
      }
      return article.snapshotChanges();
    }

    uploadPhoto(url: string, name: string, file: File, groupId: string) {
      let storageRef: AngularFireStorageReference;
      let uploadTask: AngularFireUploadTask;
      storageRef = this.afStorage.ref(`photo/${groupId}/${url}`);
      uploadTask = storageRef.child(name).put(file);
      return uploadTask;
    }

    addArticle(art: ArticleModel) {
      const article: AngularFireList<ArticleModel> = this.dataBase.list(`article`);
      const location: AngularFireList<ArticleLocationModel> = this.dataBase.list(`articleLocation/${art.groupId}`);
      return article.push(art).then(k => {
        console.log(k);
         let loc: ArticleLocationModel;
         loc = new ArticleLocationModel(); {
         loc.timestamp = art.timestamp;
         loc.idArticle = k.key;
        }
        location.push(loc);
      });
    }
}
