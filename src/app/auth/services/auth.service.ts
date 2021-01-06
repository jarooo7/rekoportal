import { Injectable, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { User } from 'firebase/app';
import { Observable } from 'rxjs';
import { AuthModel, EmailModel, ResetPasswordModel } from '../models/auth.model';
import { environment } from '../../../environments/environment';
import { AngularFireObject, AngularFireDatabase } from 'angularfire2/database';
import { UserModel, Status, ProfileModel } from '../../user/models/profile.model';
import { map } from 'rxjs/operators';
import { getFormatedSearch } from '../../shared/functions/format-search-text';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() public authState: EventEmitter<any> = new EventEmitter();
  readonly authState$: Observable<User | null> = this.fireAuth.authState;
  userName: string;
  userId: string;
  myProfile: AngularFireObject<UserModel> = null;
  userDetails: firebase.User;

  constructor(public fireAuth: AngularFireAuth,
    private dataBase: AngularFireDatabase) {
    this.authState$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.userDetails = user;
        this.userName = user.displayName;
        this.myProfile = dataBase.object(`profile/${user.uid}`);
        this.statOnline();
        this.updateOnDisconnect();
      } else {
        this.statOffline();
      }
    });
  }

  statOnline() {
    const stat: AngularFireObject<Status> = this.dataBase.object(`status/${this.userId}`);
    return stat.set({ status: 'online' });
  }
  statOffline() {
    if (this.userId) {
      const stat: AngularFireObject<Status> = this.dataBase.object(`status/${this.userId}`);
      return stat.set({ status: 'offline' }).then(() => this.userId = null);
    }
  }

  private updateOnDisconnect() {
    firebase.database().ref().child(`status/${this.userId}`)
            .onDisconnect()
            .update({status: 'offline'});
  }

  getProfile() {
    return this.myProfile.snapshotChanges();
  }

  getMyProfile(uid: string) {
    let  myProfile: AngularFireObject<ProfileModel> = null;
    myProfile = this.dataBase.object(`profile/${uid}`);
    return myProfile.snapshotChanges();
  }

  facebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.fireAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    }).then((fireBaseUser) => {
      this.authState.emit(fireBaseUser.user);
      const sub = this.getMyProfile(fireBaseUser.user.uid).pipe(
        map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
        )
      ).subscribe(p => {
        if (!p.lastName) {
          let user: ProfileModel;
          const userName = fireBaseUser.user.displayName;
          const name = userName.substring(0, userName.search(' '));
          const lastName = userName.substring(userName.search(' ') + 1);
          let textSearch: string;
          textSearch =
            `${name} ${lastName}`;
          user = new ProfileModel; {
            user.name = name;
            user.lastName = lastName;
            user.search = getFormatedSearch(textSearch.toLowerCase());
            user.platform = 'fb';
          }
          this.createProfile(user, fireBaseUser.user.uid).then(() =>
          this.fireAuth.auth.currentUser.reload()
        );
        }
        sub.unsubscribe();
      });
    }
    );
  }
  googleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.fireAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        });
    }).then((fireBaseUser) => {
      this.authState.emit(fireBaseUser.user);
      const sub = this.getMyProfile(fireBaseUser.user.uid).pipe(
        map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
        )
      ).subscribe(p => {
        if (!p.lastName) {
          let user: ProfileModel;
          const userName = fireBaseUser.user.displayName;
          const name = userName.substring(0, userName.search(' '));
          const lastName = userName.substring(userName.search(' ') + 1);
          let textSearch: string;
          textSearch =
            `${name} ${lastName}`;
          user = new ProfileModel; {
            user.name = name;
            user.lastName = lastName;
            user.search = getFormatedSearch(textSearch.toLowerCase());
            user.platform = 'google';
          }
          this.createProfile(user, fireBaseUser.user.uid);
        }
        sub.unsubscribe();
      });
    }
    );
  }

  get user(): User | null {
    return this.fireAuth.auth.currentUser;
  }

  login(auth: AuthModel) {
    return this.fireAuth.auth.signInWithEmailAndPassword(auth.email, auth.password).then((fireBaseUser) => {
      this.authState.emit(fireBaseUser);
    }
    );
  }

  register(auth: AuthModel) {
    return this.fireAuth.auth.createUserWithEmailAndPassword(auth.email, auth.password);
  }

  logout() {
    return this.fireAuth.auth.signOut();
  }

  forgotPassword(email: EmailModel) {
    return this.fireAuth.auth.sendPasswordResetEmail(email.email);
  }

  resetPassword(resetPassword: ResetPasswordModel) {
    return this.fireAuth.auth.confirmPasswordReset(resetPassword.code, resetPassword.password);
  }

  sendActiveEmail() {
    return this.fireAuth.auth.currentUser.sendEmailVerification();
  }

  createProfile(profile: ProfileModel, uid: string) {
    let  regProfile: AngularFireObject<ProfileModel> = null;
    regProfile = this.dataBase
    .object(`profile/${uid}`);
    return regProfile.set(profile);
  }

  activeEmail(code: string) {
    return this.fireAuth.auth.applyActionCode(code);
  }

  isEmailVerification() {
    return this.fireAuth.auth.currentUser.emailVerified;
  }

  getUser() {
    return this.fireAuth.authState;
  }

  changePasswordUser( password: string) {
    return this.fireAuth.auth.currentUser.updatePassword(password);
  }

  reauthenticate(currentPassword) {
    const user = firebase.auth().currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(
        user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

}
