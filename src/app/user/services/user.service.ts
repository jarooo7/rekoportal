import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { ProfileModel, AvatarModel, UserId, Status } from '../models/profile.model';
import { AuthService } from '../../auth/services/auth.service';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';
import { UserModel } from '../models/profile.model';
import { map } from 'rxjs/operators';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { PostModel, LikeModel, ComModel} from '../../shared/models/post.model';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { SubModel } from '../../group/models/group';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  myProfile: AngularFireObject<ProfileModel> = null;
  profile: AngularFireObject<UserModel> = null;
  post: AngularFireList<PostModel> = null;
  avatar: AngularFireObject<AvatarModel> = null;
  userId: string;
  user: Observable<firebase.User>;

  constructor(
    private ng2ImgToolsService: Ng2ImgToolsService,
    private dataBase: AngularFireDatabase,
    private authService: AuthService,
    public afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {
    this.user = authService.authState$;
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.myProfile = dataBase.object(`profile/${user.uid}`);
        this.avatar = dataBase.object(`profile/${user.uid}/avatar`);
        this.post = dataBase.list(`post/${user.uid}`);
        this.userId = user.uid;
      }
    });
  }

  createProfile(profile: ProfileModel) {
    return this.myProfile.set(profile);
  }

  addAvatar(avatar: AvatarModel) {
    return this.avatar.set(avatar);
  }

  getProfile(userId) {
    this.profile = this.dataBase.object(`profile/${userId}`);
    return this.profile.snapshotChanges();
  }

  getStat(userId) {
    const stat: AngularFireObject<Status> = this.dataBase.object(`status/${userId}`);
    return stat.snapshotChanges();
  }

  deleteAvatar() {
    let storageRef: AngularFireStorageReference;
    let uploadTask: AngularFireUploadTask;
    let url: string;
    let flag = true;
    this.getProfile(this.userId).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(p => {
      if (p.avatar.url && flag) {
        url = p.avatar.location;
        storageRef = this.afStorage.ref(`profile/${this.userId}`);
        uploadTask = storageRef.child(url).delete();
        flag = false;
      }
    });
  }

  time() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  getPhotoPost(url: string, name: string) {
    let urlI: string;
    let storageRef: AngularFireStorageReference;
    storageRef = this.afStorage.ref(`photo/${this.userId}/${url}`);
    urlI = storageRef.child(name).getDownloadURL();
    return urlI;
  }

  addPost(post: PostModel) {
    return this.post.push(post);
  }

  uploadPhoto(url: string, name: string, file: File) {
    let storageRef: AngularFireStorageReference;
    let uploadTask: AngularFireUploadTask;
    storageRef = this.afStorage.ref(`photo/${this.userId}/${url}`);
    uploadTask = storageRef.child(name).put(file);
    return uploadTask;
  }

  uploadPhoto2(url: string, name: string, file: File, uid: string) {
    let storageRef: AngularFireStorageReference;
    let uploadTask: AngularFireUploadTask;
    storageRef = this.afStorage.ref(`photo/${uid}/${url}`);
    uploadTask = storageRef.child(name).put(file);
    return uploadTask;
  }

  resize(file: File) {
   return this.ng2ImgToolsService.resize([file], 800, 800);
  }

  resizeAvatar(file: File) {
   return this.ng2ImgToolsService.resizeExactCrop([file], 180, 180);
  }

  upload2Avatar(file: File, name: string, id: string) {
    let storageRef: AngularFireStorageReference;
    let uploadTask: AngularFireUploadTask;
    storageRef = this.afStorage.ref(`profile`);
    uploadTask = storageRef.child(
      `${this.userId}/${name}/${id}` ).put(file);
    return uploadTask;
  }

  getMyPosts(userId: string, batch: number, lastKey?: string) {
    let post: AngularFireList<PostModel> = null;
    if (lastKey) {
      post = this.dataBase.list(`post/${userId}`, ref => ref.orderByChild('timestamp').limitToLast(batch).endAt(lastKey));
    } else {
     post = this.dataBase.list(`post/${userId}`, ref => ref.orderByChild('timestamp').limitToLast(batch));
    }
    return post.snapshotChanges();
  }

  addLike(userId: string, key: string) {
    const like: AngularFireList<LikeModel> =  this.dataBase.list(`like/${userId}/${key}`);
    let user: LikeModel;
    user = new LikeModel; {
      user.likeKey = this.userId;
    }
    return like.push(user);
  }

  getLike(userId: string, key: string) {
    const like: AngularFireList<LikeModel> =  this.dataBase.list(`like/${userId}/${key}`);
    return like.snapshotChanges();
  }

  delLike(userId: string, postKey: string, key: string, ) {
    const like: AngularFireList<LikeModel> =  this.dataBase.list(`like/${userId}/${postKey}/${key}`);
    return like.remove();
  }

  addCom(userId: string, key: string, text: string) {
    const comment: AngularFireList<ComModel> =  this.dataBase.list(`comment/${userId}/${key}`);
    let com: ComModel;
    com = new ComModel; {
      com.userKey = this.userId;
      com.text = text;
      com.timestamp = this.time();
    }
    return comment.push(com);
  }

  addInvitFriends(userId: string) {
    const invit: AngularFireList<UserId> =  this.dataBase.list(`invitFriends/${userId}`);
    invit.push({userId: this.userId});
  }

  removeinvitFriends(userId: string, key: string) {
    const invit: AngularFireList<UserId> =  this.dataBase.list(`invitFriends/${this.userId}/${key}`);
    invit.remove();
  }

  removeCom(key: string, id: string) {
    const com =  this.dataBase.object(`comment/${key}/${id}`);
    com.remove();
  }

  addFriends(userId: string , key: string) {
    this.removeinvitFriends(userId, key);
    const invit: AngularFireList<UserId> =  this.dataBase.list(`friends/${this.userId}`);
    invit.push({userId: userId, msgId: `${this.userId}${userId}`});
    const invit2: AngularFireList<UserId> =  this.dataBase.list(`friends/${userId}`);
    invit2.push({userId: this.userId,  msgId: `${this.userId}${userId}`});
  }

  loadInvitFriends() {
    const invit: AngularFireList<UserId> =  this.dataBase.list(`invitFriends/${this.userId}`);
    return invit.snapshotChanges();
  }

  loadUserInvitFriends(userId: string) {
    let invit: AngularFireList<UserId> = null;
    invit = this.dataBase.list(`invitFriends/${userId}`, ref => ref.orderByChild('userId').startAt(this.userId).endAt(this.userId));
    return invit.snapshotChanges();
  }
  loadUserInvit2Friends(userId: string) {
    let invit: AngularFireList<UserId> = null;
    invit = this.dataBase.list(`invitFriends/${this.userId}`, ref => ref.orderByChild('userId').startAt(userId).endAt(userId));
    return invit.snapshotChanges();
  }

  isMyFriend(userId: string) {
    let result: AngularFireList<UserId> = null;
    result = this.dataBase.list(`friends/${this.userId}`, ref => ref.orderByChild('userId').startAt(userId).endAt(userId));
    return result.snapshotChanges();
  }

  getCom(userId: string, key: string, batch: number, lastKey?: string) {
    let com: AngularFireList<ComModel> =  null;
    if (lastKey) {
      com = this.dataBase.list(`comment/${userId}/${key}`, ref => ref.orderByChild('timestamp').limitToLast(batch).endAt(lastKey));
    } else {
      com = this.dataBase.list(`comment/${userId}/${key}`, ref => ref.orderByChild('timestamp').limitToLast(batch));
    }
    return com.snapshotChanges();
  }

  getNewCom(userId: string, key: string, startKey: string) {
    let com: AngularFireList<ComModel> =  null;
    com = this.dataBase.list(`comment/${userId}/${key}`, ref => ref.orderByChild('timestamp').startAt(startKey));
    return com.snapshotChanges();
  }

  editUser(uid: string, name: string, lastName: string, search: string) {
    const group: AngularFireObject<ProfileModel> = this.dataBase.object(`profile/${uid}`);
    group.update({name: name, lastName: lastName, search: search});
  }

  removePost(uid: string, id: string) {
    const rv =  this.dataBase.object(`post/${uid}/${id}`);
    return rv.remove();
  }

  removeComPost(key: string, id: string) {
    const rv =  this.dataBase.object(`comment/${key}/${id}`);
    return rv.remove();
  }

  removeLike(key: string, id: string) {
    const rv =  this.dataBase.object(`like/${key}/${id}`);
    return rv.remove();
  }

  removePhoto(uid: string, d: string, nazwa: string) {
    let storageRef: AngularFireStorageReference;
    let uploadTask: AngularFireUploadTask;
    storageRef = this.afStorage.ref(`photo/${uid}/${d}`);
    uploadTask = storageRef.child(nazwa).delete();
  }

  editPost(art: PostModel, uid: string) {
    const article: AngularFireObject<PostModel> = this.dataBase.object(`post/${uid}/${art.key}`);
    return article.update({text: art.text, date: art.date, photoLoc: art.photoLoc, photos: art.photos});
  }

  isSub(uid: string) {
    const ref = this.afs.collection('sub');
    return ref.doc('user').collection<SubModel>(uid).snapshotChanges();
  }
}
