import { Component, OnInit } from '@angular/core';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/profile.model';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  backgroundUrl: string;
  idUser: string;
  user: UserModel;
  avatar: string;
  isAvatar: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private userServise: UserService
  ) {
  }

  ngOnInit() {
    this.isAvatar = false;
    this.viewBackground();
    this.readRouting();
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
      this.idUser = params['idUser'];
      this.loadRouting();
    });
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
      if (this.user.avatar) {
      this.avatar = this.userServise.getAvatar(this.user.avatar.url);
      this.isAvatar = true;
    }
    });
  }

  uploadAvatar(event) {
    this.userServise.uploadAvatar(event.target.files[0]);
  }
  editAvatar(event) {
    this.userServise.editAvatar(event.target.files[0]);
  }


}
