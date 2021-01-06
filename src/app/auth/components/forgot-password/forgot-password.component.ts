import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { ErrorCodes } from '../../../shared/enums/error-code';
import { EmailModel } from '../../models/auth.model';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';

enum FormControlNames {
  EMAIL_ADDRESS = 'email'
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  emailForm: FormGroup;
  formControlNames = FormControlNames;
  errorCode = ErrorCodes;
  destroy$: Subject<boolean> = new Subject<boolean>();
  email:  EmailModel;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private alert: AlertService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      [FormControlNames.EMAIL_ADDRESS]: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.email = this.emailForm.value;
    this.authService.forgotPassword(this.email)
    .then(
      () => {
            this.translate
              .get('alert.success.sendResetPassword')
              .pipe(takeUntil(this.destroy$))
              .subscribe(translation => {
                this.alert.showNotification('success', translation);
              });
              this.router.navigate(['/auth/login']);
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
}
