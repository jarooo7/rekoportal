import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorCodes } from '../../../shared/enums/error-code';
import { ProfileModel } from '../../models/profile.model';
import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireObject } from 'angularfire2/database';
import { map } from 'rxjs/operators';


enum FormControlNames {
  NAME = 'name',
  LAST_NAME= 'lastName',
  DATE_BIRTH  = 'dateBirth'
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
  userName: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private auth: AuthService
  ) {
    this.auth.getUser().subscribe(user => {
      console.log(user);
      if (user) {
      this.userName = user.displayName;
      this.setFormValue(user.displayName);
      }
    });
  }

  ngOnInit() {
    this.valid();
    console.log(this.userName);
    this.setFormValue(this.userName);
  }
  public onSubmit() {
    this.user = this.profileForm.value;
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
  wyswietl() {
  //  this.userService.getProfile().pipe(
  //   map( c => ({ key: c.payload.key, ...c.payload.val() })
  //   )
  // ).subscribe(customers => {
  //   this.profile = customers;
  //   console.log(customers);
  // });
 }

}

