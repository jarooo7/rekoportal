import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { UserModel } from '../../user/models/profile.model';
import { SugGroupModel } from '../../group/models/suggestionGroup';
import { ArmyModel } from '../../group/models/army';
import { GroupModel, KeyGroupnModel } from '../../group/models/group';

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

  getSugGroups() {
    const sug: AngularFireList<SugGroupModel> = this.dataBase.list('sugGroup');
    return sug.snapshotChanges();
  }

  getGroups() {
    const sug: AngularFireList<GroupModel> = this.dataBase.list('group');
    return sug.snapshotChanges();
  }

  addNewArmy(army: ArmyModel) {
    const e: AngularFireList<ArmyModel> = this.dataBase.list('otherArmies');
    return e.push(army);
  }

  addNewGroup(group: GroupModel) {
    const gr: AngularFireList<GroupModel> = this.dataBase.list('group');
    return gr.push(group);
  }

  groupInArmy(key: string, army: string) {
    const gr: AngularFireList<KeyGroupnModel> = this.dataBase.list(`army/${army}`);
    return gr.push({id: key});
  }

  removeSuggestionGroup(key: string) {
    const gr: AngularFireList<SugGroupModel> = this.dataBase.list(`sugGroup/${key}`);
    return gr.remove();
  }

  removeGroup(key: string) {
    const gr: AngularFireList<SugGroupModel> = this.dataBase.list(`group/${key}`);
    return gr.remove();
  }
  removeAdminGroup(key: string, id: string) {
    const gr: AngularFireList<SugGroupModel> = this.dataBase.list(`group/${key}/admins`, ref => ref.startAt(id).endAt(id));
    return gr.remove();
  }
}
