import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorCodes } from '../../../shared/enums/error-code';
import { environment } from '../../../../environments/environment';
import { parseError } from '../../../shared/functions/parseError';


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

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private translate: TranslateService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      [FormControlNames.EMAIL_ADDRESS]: ['',
        [Validators.required, Validators.email]],
      [FormControlNames.PASSWORD]: ['', [Validators.required]]
    });
  }
  public onSubmit() {
    return this.http.post(environment.api + 'login', this.loginForm.value).subscribe(
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
