import { Component, OnInit } from '@angular/core';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { UserModel, AvatarModel } from '../../models/profile.model';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { getFormatedDate } from '../../../shared/functions/format-date';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  backgroundUrl: string;
  idUser: string;
  invit = true;
  isFriend = true;
  invit2 = true;
  myProfile = false;
  user: UserModel;
  key: string;
  refreshKey = 'start';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private auth: AuthService,
    private userServise: UserService
  ) {
  }

  ngOnInit() {
    this.viewBackground();
    this.readRouting();
  }

  refresh() {
    this.refreshKey = Math.random().toString(36).substring(2);
  }

  viewBackground() {
    if (this.backgroundUrl === null) {
    } else {
      this.backgroundUrl = '../../../../assets/standardBG.jpg';
    }
  }

  readRouting() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.idUser = null;
      this.idUser = params['idUser'];
      this.loadRouting();
    });
  }

  private loadInvit() {
    this.userServise.loadUserInvitFriends(this.idUser).pipe(
      map(invit =>
        invit.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
      .subscribe(i => {
        if (i.length === 0) {
          this.invit = true;
        } else {
          this.invit = false;
        }
      });
  }

  private isMyFriend() {
    this.userServise.isMyFriend(this.idUser).pipe(
      map(invit =>
        invit.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
      .subscribe(i => {
        if (i.length === 0) {
          this.isFriend = false;
        } else {
          this.isFriend = true;
        }
      });
  }

  private loadInvit2() {
    this.userServise.loadUserInvit2Friends(this.idUser).pipe(
      map(invit =>
        invit.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
      .subscribe(i => {
        if (i.length === 0) {
          this.invit2 = true;
        } else {
          this.key = i[0].key;
          this.invit2 = false;
        }
      });
  }

  private operation() {
    if (this.userServise.userId) {
      if (this.userServise.userId === this.idUser) {
        this.myProfile = true;
      } else {
        this.loadInvit();
        this.loadInvit2();
        this.isMyFriend();
        this.myProfile = false;
      }
    } else {
      this.myProfile = false;
    }
  }

  loadRouting() {
    if (!this.idUser) {
      this.auth.getUser().subscribe(user => {
        if (user) {
          this.idUser = user.uid;
          this.setRouting();
        } else {
          this.loadRouting();
        }
      }
      );
    } else {
      this.loadProfileUser();
    }
  }

  canAdd() {
    if (!this.myProfile) {
      if (this.invit && this.invit2) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  setRouting() {
    this.router.navigate(['user/profile/', this.idUser]);
  }

  loadProfileUser() {
    this.userServise.getProfile(this.idUser).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(p => {
      this.user = p;
      this.operation();
    });
  }

  addInvitFriends() {
    this.userServise.addInvitFriends(this.idUser);
  }
  addFriends() {
    this.userServise.addFriends(this.idUser, this.key);
  }
  removeFriends() {
    this.userServise.removeinvitFriends(this.idUser, this.key);
  }

  uploadAvatar(event) {
    if (!event) { return; }
    let avatar: AvatarModel;
    const type = event.target.files[0].type;
    const date = getFormatedDate(new Date());
    const id = Math.random().toString(36).substring(2);
    this.userServise.resizeAvatar(event.target.files[0]).subscribe(result => {
      this.userServise.upload2Avatar(
        new File([result], 'photo', { type: type, lastModified: Date.now()}),
        date, id).then(p => {
          p.ref.getDownloadURL().then(
            url => {
              avatar = new AvatarModel; {
                avatar.url = url;
                avatar.location = `${date}/${id}`;
              }
              this.userServise.addAvatar(avatar);
            });
          });
    });
  }
  editAvatar(event) {
    this.userServise.deleteAvatar();
    this.uploadAvatar(event);
  }

  editUser() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      minWidth: '300px',
      maxWidth: '600px',
      data: this.user
    });
  }

  changePasswordUser() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      minWidth: '300px',
      maxWidth: '600px'
    });
  }

}
