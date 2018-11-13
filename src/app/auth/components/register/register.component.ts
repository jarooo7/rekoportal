import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorCodes } from '../../../shared/enums/error-code';
import { Subject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AuthModel } from '../../models/auth.model';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';

enum FormControlNames {
  EMAIL_ADDRESS = 'email',
  PASSWORD = 'password',
  AKCEPT = 'akcept'
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
      [FormControlNames.AKCEPT]: [false, [Validators.requiredTrue]]
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
      () => {
            this.translate
              .get('alert.success.register')
              .pipe(takeUntil(this.destroy$))
              .subscribe(translation => {
                this.alert.showNotification('success', translation);
              });
              this.authService.sendActiveEmail();
              this.router.navigate(['/not-active-user/not-active']);
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
                case this.errorCode.EmailAlreadyInUse : {
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

}
