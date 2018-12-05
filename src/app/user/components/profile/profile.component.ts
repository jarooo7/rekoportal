import { Component, OnInit } from '@angular/core';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { UserModel, AvatarModel } from '../../models/profile.model';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { getFormatedDate } from '../../../shared/functions/format-date';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  backgroundUrl: string;
  idUser: string;
  invit = false;
  myProfile = false;
  user: UserModel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private userServise: UserService
  ) {
  }

  ngOnInit() {
    this.viewBackground();
    this.readRouting();
    this.isYour();
  }

  viewBackground() {
    if (this.backgroundUrl === null) {
      console.log('ni chuja');
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
    this.userServise.loadInvitFriends().pipe(
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

  private isYour() {
    if (this.userServise.userId) {
      if (this.userServise.userId === this.idUser) {
        this.myProfile = true;
      } else {
        this.loadInvit();
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

  setRouting() {
    this.router.navigate(['user/profile/', this.idUser]);
  }

  loadProfileUser() {
    this.userServise.getProfile(this.idUser).pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(p => {
      this.user = new UserModel(); {
        this.user.name = p.name;
        this.user.lastName = p.lastName;
        this.user.dateBirth = p.dateBirth;
        this.user.avatar = p.avatar;
      }
    });
  }

  addFriends() {
    this.userServise.addInvitFriends(this.idUser);
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


}
