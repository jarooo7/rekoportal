import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { ErrorCodes } from '../../../shared/enums/error-code';
import { ProfileModel } from '../../models/profile.model';
import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireObject } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import { getFormatedSearch } from '../../../shared/functions/format-search-text';


enum FormControlNames {
  NAME = 'name',
  LAST_NAME = 'lastName',
  DATE_BIRTH = 'dateBirth'
}
@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent implements OnInit {

  profileForm: FormGroup;
  formControlNames = FormControlNames;
  errorCode = ErrorCodes;
  destroy$: Subject<boolean> = new Subject<boolean>();
  user: ProfileModel;
  name: string;
  lastName: string;
  profile: any;
  userSub: Observable<firebase.User>;
  userName: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private auth: AuthService
  ) {
    this.userSub = auth.authState$;
  }

  ngOnInit() {
    this.valid();
    this.userSub.subscribe(u => {
      if (u) {
        if (u.displayName) {
          this.userName = u.displayName;
          this.setFormValue(u.displayName);
        }
      }
    });
  }
  public onSubmit() {
    let textSearch: string;
    textSearch = `${this.profileForm.get(FormControlNames.NAME).value} ${this.profileForm.get(FormControlNames.LAST_NAME).value}`;
    this.user = new ProfileModel; {
      this.user.name = this.profileForm.get(FormControlNames.NAME).value;
      this.user.lastName = this.profileForm.get(FormControlNames.LAST_NAME).value;
      this.user.dateBirth = this.profileForm.get(FormControlNames.DATE_BIRTH).value;
      this.user.search = getFormatedSearch(textSearch.toLowerCase());
    }
    this.userService.createProfile(this.user);
  }

  valid() {
    this.profileForm = this.formBuilder.group({
      [FormControlNames.NAME]: ['', [Validators.required]],
      [FormControlNames.LAST_NAME]: ['', [Validators.required]],
      [FormControlNames.DATE_BIRTH]: ['', [Validators.required]]
    });
  }

  setFormValue(userName: string) {
    if (userName) {
      this.name = userName.substring(0, userName.search(' '));
      this.lastName = userName.substring(userName.search(' ') + 1);
      this.profileForm.setValue({
        [FormControlNames.NAME]: this.name,
        [FormControlNames.LAST_NAME]: this.lastName,
        [FormControlNames.DATE_BIRTH]: null
      });
    }
  }

}
