import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AuthService } from '../../auth/services/auth.service';
import { SugGroupModel } from '../models/suggestionGroup';
import { GroupModel } from '../models/group';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from 'angularfire2/storage';
import { ArticleModel, ArticleLocationModel } from '../models/article';
import { ArmyModel } from '../models/army';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { AvatarModel, UserModel } from '../../user/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class GropuService {

  userId: string;

  constructor(
    private dataBase: AngularFireDatabase,
    private authService: AuthService,
    private ng2ImgToolsService: Ng2ImgToolsService,
    private afStorage: AngularFireStorage
  ) {
      this.authService.authState$.subscribe(user => {
        if (user) {
          this.userId = user.uid;
        }
      });
    }

    getProfile(uid: string) {
      let  myProfile: AngularFireObject<UserModel> = null;
      myProfile = this.dataBase.object(`profile/${uid}`);
      return myProfile.snapshotChanges();
    }

    addSuggestionGroup(sug: SugGroupModel) {
      const gr: AngularFireList<SugGroupModel> = this.dataBase.list('sugGroup');
      return gr.push(sug);
    }

    getGroup(id) {
      const gr: AngularFireObject<GroupModel> = this.dataBase.object(`group/${id}`);
      return gr.snapshotChanges();
    }

    getGroups(army: string) {
      const sug: AngularFireList<GroupModel> = this.dataBase.list(`army/${army}`);
      return sug.snapshotChanges();
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

    editArticle(art: ArticleModel) {
      const article: AngularFireObject<ArticleModel> = this.dataBase.object(`article/${art.key}`);
      return article.update({text: art.text, date: art.date, title: art.title, photoLoc: art.photoLoc, photos: art.photos});
    }

    getOtherArmies() {
      const a: AngularFireList<ArmyModel> = this.dataBase.list('otherArmies');
      return a.snapshotChanges();
    }

    resizeAvatar(file: File) {
      return this.ng2ImgToolsService.resizeExactCrop([file], 180, 180);
    }

    upload2Avatar(file: File, name: string, id: string, groupId: string) {
      let storageRef: AngularFireStorageReference;
      let uploadTask: AngularFireUploadTask;
      storageRef = this.afStorage.ref(`group`);
      uploadTask = storageRef.child(
        `${groupId}/${name}/${id}` ).put(file);
      return uploadTask;
    }

    addAvatar(a: AvatarModel, groupId: string) {
      const avatar: AngularFireObject<AvatarModel> = this.dataBase.object(`group/${groupId}/avatar`);
      return avatar.set(a);
    }

    deleteAvatar(gid: string, url: string) {
      let storageRef: AngularFireStorageReference;
      let uploadTask: AngularFireUploadTask;
      storageRef = this.afStorage.ref(`group/${gid}`);
      uploadTask = storageRef.child(url).delete();
    }

    editGroup(groupId: string, name: string, description: string) {
      const group: AngularFireObject<GroupModel> = this.dataBase.object(`group/${groupId}`);
      group.update({name: name, description: description});
    }

    updateAdminsGroup(groupId: string, admins: string[]) {
      const group: AngularFireObject<GroupModel> = this.dataBase.object(`group/${groupId}`);
      group.update({admins: admins});
    }
    setAdminsGroup(groupId: string, admins: string[]) {
      const group: AngularFireObject<string[]> = this.dataBase.object(`group/${groupId}/admins`);
      group.update(admins);
    }

    removeArticle(id: string) {
      const rv =  this.dataBase.object(`article/${id}`);
      return rv.remove();
    }

    removeArticleLocation(key: string, id: string) {
      const rv =  this.dataBase.object(`articleLocation/${key}/${id}`);
      return rv.remove();
    }

    removeCom(key: string, id: string) {
      const rv =  this.dataBase.object(`comment/${key}/${id}`);
      return rv.remove();
    }

    removeLike(key: string, id: string) {
      const rv =  this.dataBase.object(`like/${key}/${id}`);
      return rv.remove();
    }

    removePhoto(gid: string, d: string, nazwa: string) {
      let storageRef: AngularFireStorageReference;
      let uploadTask: AngularFireUploadTask;
      storageRef = this.afStorage.ref(`photo/${gid}/${d}`);
      uploadTask = storageRef.child(nazwa).delete();
    }
}
