import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { User } from 'firebase/app';
import { Observable } from 'rxjs';
import { AuthModel, EmailModel, ResetPasswordModel } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly authState$: Observable<User | null> = this.fireAuth.authState;

  constructor(public fireAuth: AngularFireAuth) { }

  facebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.fireAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
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
      });
    }

    get user(): User | null {
      return this.fireAuth.auth.currentUser;
    }

    login(auth:  AuthModel) {
      return this.fireAuth.auth.signInWithEmailAndPassword(auth.email, auth.password);
    }

    register(auth:  AuthModel) {
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
}
