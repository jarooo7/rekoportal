import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rekoportal-frontend';
  isUser: boolean;
  user: Observable<firebase.User>;
  constructor(
    private authService: AuthService,
    private translateService: TranslateService
  ) {
    this.user = authService.authState$;
    this.user.subscribe(u => {
      if (u) {
        this.isUser = true;
      } else {
        this.isUser = false;
      }
    });

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
        default: {
          translateService.setDefaultLang('pl');
        }
      }
    } else {
      translateService.setDefaultLang('pl');
    }
  }
}
