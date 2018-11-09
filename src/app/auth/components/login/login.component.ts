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
    private notifier: NotifierService,
    private authService: AuthService,
    private translate: TranslateService
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
            this.showNotification('success', translation);
          });
      })
      .catch(
      error => {
        switch (error.code) {
          case this.errorCode.UserNotFound : {
            this.translate
            .get('alert.error.userNotFound')
            .pipe(takeUntil(this.destroy$))
            .subscribe(translation => {
              this.showNotification('error', translation);
            });
          break;
          }
          case this.errorCode.WrongPassword : {
            this.translate
            .get('alert.error.wrongPassword')
            .pipe(takeUntil(this.destroy$))
            .subscribe(translation => {
              this.showNotification('error', translation);
            });
          break;
          }
          case this.errorCode.InvalidEmail : {
            this.translate
            .get('alert.error.invalidEmail')
            .pipe(takeUntil(this.destroy$))
            .subscribe(translation => {
              this.showNotification('error', translation);
            });
          break;
          }
          default: {
            this.translate
            .get('alert.error.notConect')
            .pipe(takeUntil(this.destroy$))
            .subscribe(translation => {
              this.showNotification('error', translation);
            });
            break;
          }
        }
      }
    );
  }

public loginFb() {
  this.authService.facebookLogin()
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
          this.showNotification('success', translation);
        });
    })
  .catch(
    error => console.log(error)
  );
}


  private showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
  }
}
