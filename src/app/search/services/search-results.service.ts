import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { UserModel } from '../../user/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class SearchResultsService {

  constructor(
    private dataBase: AngularFireDatabase
  ) { }

  getUser(start, end) {
    let com: AngularFireList<UserModel> =  null;
    com = this.dataBase.list('profile', ref => ref.orderByChild('search').startAt(start).endAt(end));
    return com.snapshotChanges();
  }
  get3User(start, end) {
    let com: AngularFireList<UserModel> =  null;
    com = this.dataBase.list('profile', ref => ref.orderByChild('search').startAt(start).limitToFirst(3).endAt(end));
    return com.snapshotChanges();
  }
}
