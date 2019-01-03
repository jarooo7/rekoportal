import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorCodes } from '../../../shared/enums/error-code';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AuthModel } from '../../models/auth.model';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { ProfileModel } from '../../../user/models/profile.model';
import { getFormatedSearch } from '../../../shared/functions/format-search-text';

enum FormControlNames {
  EMAIL_ADDRESS = 'email',
  PASSWORD = 'password',
  NAME = 'name',
  LAST_NAME = 'lastName'
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  formControlNames = FormControlNames;
  errorCode = ErrorCodes;
  destroy$: Subject<boolean> = new Subject<boolean>();
  auth: AuthModel;
  user: ProfileModel;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private alert: AlertService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      [FormControlNames.EMAIL_ADDRESS]: ['',
        [Validators.required, Validators.email]],
      [FormControlNames.PASSWORD]: ['', [Validators.required]],
      [FormControlNames.NAME]: ['', [Validators.required]],
      [FormControlNames.LAST_NAME]: ['', [Validators.required]],
    });
  }
  public onSubmit() {
    this.auth = new AuthModel(); {
      this.auth.email = this.registerForm.value[FormControlNames.EMAIL_ADDRESS];
      this.auth.password = this.registerForm.value[FormControlNames.PASSWORD];
    }
    this.authService
      .register(this.auth)
      .then(
        u => {
          this.translate
            .get('alert.success.register')
            .pipe(takeUntil(this.destroy$))
            .subscribe(translation => {
              this.alert.showNotification('success', translation);
            });
          this.createProfile(u.user.uid);
        })
      .catch(
        error => {
          switch (error.code) {
            case this.errorCode.UserNotFound: {
              this.translate
                .get('alert.error.userNotFound')
                .pipe(takeUntil(this.destroy$))
                .subscribe(translation => {
                  this.alert.showNotification('error', translation);
                });
              break;
            }
            case this.errorCode.InvalidEmail: {
              this.translate
                .get('alert.error.invalidEmail')
                .pipe(takeUntil(this.destroy$))
                .subscribe(translation => {
                  this.alert.showNotification('error', translation);
                });
              break;
            }
            case this.errorCode.EmailAlreadyInUse: {
              this.translate
                .get('alert.error.emailAlreadyInUse')
                .pipe(takeUntil(this.destroy$))
                .subscribe(translation => {
                  this.alert.showNotification('error', translation);
                });
              break;
            }
            default: {
              this.translate
                .get('alert.error.notConect')
                .pipe(takeUntil(this.destroy$))
                .subscribe(translation => {
                  this.alert.showNotification('error', translation);
                });
              break;
            }
          }
        }
      );
  }

  createProfile(uid: string) {
    let textSearch: string;
    textSearch =
      `${this.registerForm.get(FormControlNames.NAME).value} ${this.registerForm.get(FormControlNames.LAST_NAME).value}`;
    this.user = new ProfileModel; {
      this.user.name = this.registerForm.get(FormControlNames.NAME).value;
      this.user.lastName = this.registerForm.get(FormControlNames.LAST_NAME).value;
      this.user.search = getFormatedSearch(textSearch.toLowerCase());
      this.user.platform = 'email';
    }
    this.authService.createProfile(this.user, uid).then(
      () => {
        this.authService.sendActiveEmail();
        this.router.navigate(['/not-active-user/not-active']);
      }
    );

  }
}
