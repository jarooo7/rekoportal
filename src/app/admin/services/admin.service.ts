import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { UserModel } from '../../user/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor( private dataBase: AngularFireDatabase) { }

  getProfile(userId) {
    const profile: AngularFireObject<UserModel> = this.dataBase.object(`profile/${userId}`);
    return profile.snapshotChanges();
  }

  // getProfiles(batch: number, lastKey?: string) {
  //   let profile: AngularFireList<UserModel> = null;
  //   if (lastKey) {
  //     profile = this.dataBase.list(`profile`, ref => ref.orderByKey().limitToFirst(batch).startAt(lastKey));
  //   } else {
  //     profile = this.dataBase.list(`profile`, ref => ref.orderByKey().limitToFirst(batch).startAt(lastKey));
  //   }
  //   return profile.snapshotChanges();
  // }

  getProfiles(search?: string) {
    let profile: AngularFireList<UserModel> = null;
    if (search) {
      profile = this.dataBase.list(`profile`, ref => ref.orderByKey().startAt(search).endAt(search + '\uf8ff'));
    } else {
      profile = this.dataBase.list(`profile`);
    }
    return profile.snapshotChanges();
  }

  addAdmin(id: string) {
    const profile: AngularFireObject<UserModel> = this.dataBase.object(`profile/${id}`);
    return profile.update({isAdmin: true});
  }
  delAdmin(id: string) {
    const profile: AngularFireObject<UserModel> = this.dataBase.object(`profile/${id}`);
    return profile.update({isAdmin: false});
  }

}
