import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ErrorCodes } from '../../../shared/enums/error-code';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { ResetPasswordModel } from '../../../auth/models/auth.model';
import { AuthService } from '../../../auth/services/auth.service';

enum FormControlNames {
  PASSWORD = 'password'
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './email-action.component.html',
  styleUrls: ['./email-action.component.scss']
})
export class EmailActionComponent implements OnInit {

  resetPasswordForm: FormGroup;
  formControlNames = FormControlNames;
  errorCode = ErrorCodes;
  destroy$: Subject<boolean> = new Subject<boolean>();
  reset:  ResetPasswordModel;
  token: string;
  code: string;
  action: string;
  viewForm: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private alert: AlertService
  ) {
    this.token = this.router.url;
  }

  ngOnInit() {
    const indexStart = this.token.search('mode=');
    const indexEnd = this.token.search('&oobCode=');
    this.action = this.token.substring(indexStart + 5, indexEnd);
    if (this.action === 'verifyEmail') {
      this.viewForm = false;
      this.loadCode();
      this.authService.activeEmail(this.code)
      .then( () => {
        this.translate
          .get('alert.success.active')
          .pipe(takeUntil(this.destroy$))
          .subscribe(translation => {
            this.alert.showNotification('success', translation);
          });
          this.router.navigate(['/table-post/posts']);
       })
      .catch(
        () => {
          this.translate
            .get('alert.error.notActive')
            .pipe(takeUntil(this.destroy$))
            .subscribe(translation => {
              this.alert.showNotification('error', translation);
            });
            this.router.navigate(['/not-active-user/not-active']);
         });
    } else {
      this.viewForm = true;
    }
    this.resetPasswordForm = this.formBuilder.group({
      [FormControlNames.PASSWORD]: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  loadCode() {
    const indexStart = this.token.search('oobCode=');
    const indexEnd = this.token.search('&apiKey=');
    this.code = this.token.substring(indexStart + 8, indexEnd);
  }

  onSubmit() {
    this.loadCode();
    this.reset = new ResetPasswordModel; {
      this.reset.password  = this.resetPasswordForm.value[FormControlNames.PASSWORD];
      this.reset.code = this.code;
   }
   this.loadCode();
     this.authService.resetPassword(this.reset)
     .then(
       () => {
            this.translate
              .get('alert.success.resetPassword')
              .pipe(takeUntil(this.destroy$))
              .subscribe(translation => {
                this.alert.showNotification('success', translation);
              });
              this.router.navigate(['/auth/login']);
           })
         .catch(
          error => {
            switch (error.code) {
              case this.errorCode.InvalidCode : {
                this.translate
                .get('alert.error.invalidCode')
                .pipe(takeUntil(this.destroy$))
                .subscribe(translation => {
                  this.alert.showNotification('error', translation);
                });
                this.router.navigate(['/auth/forgot-password']);
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
