import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorCodes } from '../../../shared/enums/error-code';
import { Subject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { parseError } from '../../../shared/functions/parseError';

enum FormControlNames {
  EMAIL_ADDRESS = 'email',
  PASSWORD = 'password',
  NAME = 'name',
  RE_PASSWORD = 'rePassword',
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

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private translate: TranslateService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      [FormControlNames.EMAIL_ADDRESS]: ['',
        [Validators.required, Validators.email]],
      [FormControlNames.PASSWORD]: ['', [Validators.required]],
      [FormControlNames.RE_PASSWORD]: ['', [Validators.required]],
      [FormControlNames.NAME]: ['', [Validators.required]],
    });
  }
  public onSubmit() {
    return this.http.post(environment.api + 'register', this.registerForm.value).subscribe(
      () => {
        this.translate
          .get('alert.success.welcom')
          .pipe(takeUntil(this.destroy$))
          .subscribe(translation => {
            this.showNotification('success', translation);
          });
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        const response = parseError(error);
        if (response.code === this.errorCode.UserNotFound) {
          console.log(response);
          this.translate
            .get('alert.error.userNotFound')
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
  private showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
  }

}
