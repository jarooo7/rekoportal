import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ProfileModel } from '../models/profile.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  profile: AngularFireObject<ProfileModel> = null;
  userName: string;


  constructor(
    private dataBase: AngularFireDatabase,
    private authService: AuthService
  ) {
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.profile = dataBase.object(`profile/${user.uid}`);
        this.userName = user.displayName;
      }
    });
  }

  createProfile(profile: ProfileModel) {
    return this.profile.set(profile);
  }

  getProfile() {
    return this.profile.snapshotChanges();
  }


}
