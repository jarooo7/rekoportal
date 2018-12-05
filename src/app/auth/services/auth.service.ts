import { Injectable, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { User } from 'firebase/app';
import { Observable } from 'rxjs';
import { AuthModel, EmailModel, ResetPasswordModel } from '../models/auth.model';
import { environment } from '../../../environments/environment';
import { AngularFireObject, AngularFireDatabase } from 'angularfire2/database';
import { UserModel } from '../../user/models/profile.model';


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
      }
    });

  }

  getProfile() {
    return this.myProfile.snapshotChanges();
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
      this.setUser();
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

  activeEmail(code: string) {
    return this.fireAuth.auth.applyActionCode(code);
  }

  isEmailVerification() {
    return this.fireAuth.auth.currentUser.emailVerified;
  }

  getUserId() {
    return localStorage.getItem(environment.userId);
  }

  removeUser() {
    localStorage.getItem(environment.userId);
    localStorage.getItem(environment.displayName);
  }

  setUser() {
    this.authState$.subscribe(user => {
      if (user) {
        user.getIdToken().then(u => localStorage.setItem(environment.userId, u));
      }
    }
    );
  }

  getUser() {
    return this.fireAuth.authState;
  }
}
