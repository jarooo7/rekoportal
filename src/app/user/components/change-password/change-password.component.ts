import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../shared/services/alert.service';
import { ErrorCodes } from '../../../shared/enums/error-code';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

enum FormControlNames {
  CURRENT_PASSWORD = 'curentPassword',
  NEW_PASSWORD = 'newPassword'
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  passwordForm: FormGroup;
  formControlNames = FormControlNames;
  errorCode = ErrorCodes;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private translate: TranslateService,
    private alert: AlertService
  ) { }
  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      [FormControlNames.CURRENT_PASSWORD]: ['', [Validators.required]],
      [FormControlNames.NEW_PASSWORD]: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.authService.reauthenticate(this.passwordForm.value[FormControlNames.CURRENT_PASSWORD])
      .then(() => {
        this.authService.changePasswordUser(
          this.passwordForm.value[FormControlNames.NEW_PASSWORD]
        ).then(
          () => {
            this.translate
              .get('alert.success.resetPassword')
              .pipe(takeUntil(this.destroy$))
              .subscribe(translation => {
                this.alert.showNotification('success', translation);
              });
            this.onNoClick();
          })
          .catch(
            () => {
              this.translate
                .get('alert.error.notConect')
                .pipe(takeUntil(this.destroy$))
                .subscribe(translation => {
                  this.alert.showNotification('error', translation);
                });
            });
      }).catch(() => {
        this.translate
          .get('alert.error.wrongPassword')
          .pipe(takeUntil(this.destroy$))
          .subscribe(translation => {
            this.alert.showNotification('error', translation);
          });
      });
  }

}
