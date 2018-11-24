import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorCodes } from '../../../shared/enums/error-code';
import { AuthService } from '../../services/auth.service';
import { AuthModel } from '../../models/auth.model';
import { AlertService } from '../../../shared/services/alert.service';
import { Router } from '@angular/router';



enum FormControlNames {
  EMAIL_ADDRESS = 'email',
  PASSWORD = 'password'
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formControlNames = FormControlNames;
  errorCode = ErrorCodes;
  destroy$: Subject<boolean> = new Subject<boolean>();
  auth: AuthModel;

  constructor(
    private formBuilder: FormBuilder,
    private alert: AlertService,
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      [FormControlNames.EMAIL_ADDRESS]: ['',
        [Validators.required, Validators.email]],
      [FormControlNames.PASSWORD]: ['', [Validators.required]]
    });
  }
  public onSubmit() {
    this.auth = this.loginForm.value;
    this.authService
    .login(this.auth)
    .then(
      () => {
        this.translate
          .get('alert.success.welcom')
          .pipe(takeUntil(this.destroy$))
          .subscribe(translation => {
            this.alert.showNotification('success', translation);
          });
          // this.authService.setUser(this.authService.fireAuth.auth.currentUser.)
          if (!this.authService.isEmailVerification()) {
            this.router.navigate(['/not-active-user/not-active']);
          } else {
            this.router.navigate(['/user']);
          }
      })
      .catch(
      error => {
        switch (error.code) {
          case this.errorCode.UserNotFound : {
            this.translate
            .get('alert.error.userNotFound')
            .pipe(takeUntil(this.destroy$))
            .subscribe(translation => {
              this.alert.showNotification('error', translation);
            });
          break;
          }
          case this.errorCode.WrongPassword : {
            this.translate
            .get('alert.error.wrongPassword')
            .pipe(takeUntil(this.destroy$))
            .subscribe(translation => {
              this.alert.showNotification('error', translation);
            });
          break;
          }
          case this.errorCode.InvalidEmail : {
            this.translate
            .get('alert.error.invalidEmail')
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

public loginFb() {
  this.authService.facebookLogin()
  .then(() =>
      this.router.navigate(['/user'])
  )
  .catch(
    error => console.log(error)
  );
}

public loginGoogle() {
  this.authService.googleLogin()
  .then(
    () => {
      this.translate
        .get('alert.success.welcom')
        .pipe(takeUntil(this.destroy$))
        .subscribe(translation => {
          this.alert.showNotification('success', translation);
        });
          this.router.navigate(['/user']);
    })
  .catch(
    error => console.log(error)
  );
}

}
