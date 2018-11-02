import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rekoportal-frontend';
  constructor( private translateService: TranslateService ) {
    if (localStorage.getItem(environment.language) === 'en') {
      translateService.setDefaultLang('en');
    } else {
      translateService.setDefaultLang('pl');
    }
  }
}
