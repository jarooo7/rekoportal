import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorCodes } from '../../../shared/enums/error-code';
import { Subject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AuthModel } from '../../models/auth.model';

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
    private notifier: NotifierService,
    private authService: AuthService
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
              .get('alert.success.welcom')
              .pipe(takeUntil(this.destroy$))
              .subscribe(translation => {
                this.showNotification('success', translation);
              });
          })
          .catch(
          error => {
            if (error.code === this.errorCode.IsEmail) {
              this.translate
                .get('alert.error.isEmail')
                .pipe(takeUntil(this.destroy$))
                .subscribe(translation => {
                  this.showNotification('error', translation);
                });
            } else {
              this.translate
                .get('alert.error.notConect')
                .pipe(takeUntil(this.destroy$))
                .subscribe(translation => {
                  this.showNotification('error', translation);
                });
            }
          }
    );
  }
  logout() {
    this.authService.logout();
  }
  private showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
  }

}
