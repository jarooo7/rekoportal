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
  constructor(private translateService: TranslateService) {
    if (localStorage.getItem(environment.language)) {
      switch (localStorage.getItem(environment.language)) {
        case 'en': {
          translateService.setDefaultLang('en');
          break;
        }
        case 'pl': {
          translateService.setDefaultLang('pl');
          break;
        }
        case 'ru': {
          translateService.setDefaultLang('ru');
          break;
        }
        case 'de': {
          translateService.setDefaultLang('de');
          break;
        }
        case 'sk': {
          translateService.setDefaultLang('sk');
          break;
        }
        case 'lt': {
          translateService.setDefaultLang('lt');
          break;
        }
        case 'fr': {
          translateService.setDefaultLang('fr');
          break;
        }
        default: {
          translateService.setDefaultLang('pl');
        }
      }
    } else {
      translateService.setDefaultLang('pl');
    }
  }
}
