import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      [FormControlNames.EMAIL_ADDRESS]: ['',
        [Validators.required, Validators.email]],
      [FormControlNames.PASSWORD]: ['', [Validators.required]]
    });
  }
  onSubmit() {
    console.log(this.loginForm.value);
  }
}
