import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { ProfileModel, AvatarModel } from '../models/profile.model';
import { AuthService } from '../../auth/services/auth.service';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';
import { UserModel } from '../models/profile.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  myProfile: AngularFireObject<ProfileModel> = null;
  profile: AngularFireObject<UserModel> = null;
  avatar: AngularFireObject<AvatarModel> = null;
  storageRef: AngularFireStorageReference;
  uploadTask: AngularFireUploadTask;
  userId: string;


  constructor(
    private dataBase: AngularFireDatabase,
    private authService: AuthService,
    private afStorage: AngularFireStorage
  ) {
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.myProfile = dataBase.object(`profile/${user.uid}`);
        this.avatar = dataBase.object(`profile/${user.uid}/avatar`);
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
    const id = Math.random().toString(36).substring(2);
    this.storageRef = this.afStorage.ref('profile');
    this.uploadTask = this.storageRef.child(
      `${this.userId}/${today.getFullYear()}-${today.getMonth()}-${today.getDay()}${today.getMilliseconds()}${id}`
    ).put(file);
    this.uploadTask.then(
      () => {
        const avatar = new AvatarModel(); {
          avatar.date = today;
          avatar.url = `${this.userId}/${today.getFullYear()}-${today.getMonth()}-${today.getDay()}${today.getMilliseconds()}${id}`;
        }
        this.addAvatar(avatar);
      }
    );
  }

  deleteAvatar() {
    let url: string;
    this.getProfile(this.userId).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(p => {url = p.avatar.url; });
    this.storageRef = this.afStorage.ref('profile');
    this.uploadTask = this.storageRef.child(url).delete();
  }

  editAvatar(file: File) {
    this.deleteAvatar();
    this.uploadAvatar(file);
  }

  getAvatar(url: string) {
    this.storageRef = this.afStorage.ref('profile');
    return this.storageRef.child(url).getDownloadURL();
  }

}
