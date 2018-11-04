import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';


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

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      [FormControlNames.EMAIL_ADDRESS]: ['',
        [Validators.required, Validators.email]],
      [FormControlNames.PASSWORD]: ['', [Validators.required]]
    });
  }
  public onSubmit( ) {
    return this.http.post(environment.api + 'login', this.loginForm.value).subscribe(
      () => this.showNotification('success', 'Zalogowałeś się'),
      error =>  this.showNotification('error', error.error.message),
    );
  }
  private showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }
}
