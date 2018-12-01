import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { ProfileModel, AvatarModel } from '../models/profile.model';
import { AuthService } from '../../auth/services/auth.service';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';
import { UserModel } from '../models/profile.model';
import { map } from 'rxjs/operators';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { PostModel, LikeModel, ComModel} from '../../shared/models/post.model';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  myProfile: AngularFireObject<ProfileModel> = null;
  profile: AngularFireObject<UserModel> = null;
  post: AngularFireList<PostModel> = null;
  avatar: AngularFireObject<AvatarModel> = null;
  userId: string;


  constructor(
    private ng2ImgToolsService: Ng2ImgToolsService,
    private dataBase: AngularFireDatabase,
    private authService: AuthService,
    private afStorage: AngularFireStorage
  ) {
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

  uploadAvatar(file: File) {
    const today = new Date();
    const type = file.type;
    let storageRef: AngularFireStorageReference;
    let uploadTask: AngularFireUploadTask;
    const id = Math.random().toString(36).substring(2);
    storageRef = this.afStorage.ref('profile');
    this.ng2ImgToolsService.resizeExactCrop([file], 180, 180).subscribe(result => {
      uploadTask = storageRef.child(
        `${this.userId}/${today.getFullYear()}-${today.getMonth()}-${today.getDay()}${today.getMilliseconds()}${id}`
      ).put(new File([result], 'photo', { type: type, lastModified: Date.now() }));
      uploadTask.then(
        () => {
          const avatar = new AvatarModel(); {
            avatar.date = today;
            avatar.url = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}${today.getMilliseconds()}${id}`;
          }
          this.addAvatar(avatar);
        }
      );
    });
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
        url = p.avatar.url;
        storageRef = this.afStorage.ref(`profile/${this.userId}`);
        uploadTask = storageRef.child(url).delete();
        flag = false;
      }
    });
  }

  editAvatar(file: File) {
    if (!file) {
      return;
    }
    this.deleteAvatar();
    this.uploadAvatar(file);
  }

  time() {
    return firebase.database.ServerValue.TIMESTAMP;
  }


  getAvatar(url: string, userId: string) {
    let storageRef: AngularFireStorageReference;
    storageRef = this.afStorage.ref(`profile/${userId}`);
    return storageRef.child(url).getDownloadURL();
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

  resize(file: File) {
   return this.ng2ImgToolsService.resize([file], 800, 800);
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

  getCom(userId: string, key: string, batch: number, lastKey?: string) {
    let com: AngularFireList<ComModel> =  null;
    if (lastKey) {
      com = this.dataBase.list(`comment/${userId}/${key}`, ref => ref.orderByChild('timestamp').limitToLast(batch).endAt(lastKey));
    } else {
      com = this.dataBase.list(`comment/${userId}/${key}`, ref => ref.orderByChild('timestamp').limitToLast(batch));
    }
    return com.snapshotChanges();
  }
}
