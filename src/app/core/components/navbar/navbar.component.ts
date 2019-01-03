import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../../user/services/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { getFormatedSearch } from '../../../shared/functions/format-search-text';
import { SearchResultsService } from '../../../search/services/search-results.service';
import { UserModel, AvatarModel, UserId } from '../../../user/models/profile.model';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

enum FormControlNames {
  SEARCH = 'search'
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  language: string;
  countryFlag: string;
  searchText: string;
  searchForm: FormGroup;
  formControlNames = FormControlNames;
  view = true;
  invit: UserId[] = [];
  isAdmin: boolean;
  invitFlag = false;
  avatar: AvatarModel;
  uid: string;
  user: Observable<firebase.User>;
  result: UserModel[] = [];
  private conectUser: any;
  languageList = [
    {
      name: 'en',
      src: '../../../../assets/language/en.svg'
    },
    {
      name: 'pl',
      src: '../../../../assets/language/pl.svg'
    },
    {
      name: 'ru',
      src: '../../../../assets/language/ru.svg'
    },
    {
      name: 'lt',
      src: '../../../../assets/language/lt.svg'
    },
    {
      name: 'fr',
      src: '../../../../assets/language/fr.svg'
    },
    {
      name: 'sk',
      src: '../../../../assets/language/sk.svg'
    },
    {
      name: 'de',
      src: '../../../../assets/language/de.svg'
    }
  ];
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private searchService: SearchResultsService
  ) {
    this.user = authService.authState$;
    this.user.subscribe(u => {
      if (u) {
        if (u.uid) {
          this.uid = u.uid;
          this.loadUser();
          this.loadInvit();
        }
      }
    });
  }

  ngOnInit() {
    this.loadLanguage();
    this.searchForm = this.formBuilder.group({
      [FormControlNames.SEARCH]: ['']
    });
  }
  loadLanguage() {
    if (localStorage.getItem(environment.language)) {
      this.language = localStorage.getItem(environment.language);
    } else {
      this.language = 'pl';
    }
    this.countryFlag = `../../../../assets/language/${this.language}.svg`;
  }
  useLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem(environment.language, language);
    this.language = language;
    this.countryFlag = `../../../../assets/language/${this.language}.svg`;
  }

  invitOpen() {
    this.invitFlag = !this.invitFlag;
  }

  isInvit(): string {
    if (this.invit) {
      if (this.invit.length === 0) {
        return 'true';
      }
      return 'false';
    }
    return 'true';
  }

  isLogin() {
    if (this.authService.fireAuth.auth.currentUser === null) {
      return false;
    } else {
      return true;
    }
  }

  loadUser() {
    this.conectUser = this.authService.getProfile().pipe(
      map(profile => ({ key: profile.payload.key, ...profile.payload.val() })
      )
    ).subscribe(p => {
      this.avatar = p.avatar;
      this.isAdmin = p.isAdmin;

    });
  }
  loadInvit() {
    this.userService.loadInvitFriends().pipe(
      map(invit =>
        invit.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ))
      .subscribe(i => {
        this.invit = i;
      });
  }

  logout() {
    this.authService.logout().then(() =>
    this.router.navigate(['/auth/login']));
  }
  search() {
    this.view = false;
    const text: string = this.searchForm.get(FormControlNames.SEARCH).value;
    this.router.navigate([`search/result-search/${getFormatedSearch(text.toLocaleLowerCase())}`]);
  }

  goToMyProfile() {
    this.router.navigate([`user/profile/${this.uid}`]);
  }

  goToAdmin() {
    this.router.navigate(['/admin/admin-panel']);
  }

  searchNow(event) {
    this.view = true;
    const textSearch = getFormatedSearch(event.toLocaleLowerCase());
    if (textSearch.length < 3) {
      this.result = [];
      return;
    }
    this.searchService.get3User(textSearch, textSearch + '\uf8ff')
      .pipe(
        map(like =>
          like.map(l => ({ key: l.payload.key, ...l.payload.val() }))
        ))
      .subscribe(u => {
        this.result = u;
      });
  }

  hidesearch() {
    this.view = false;
  }

}
