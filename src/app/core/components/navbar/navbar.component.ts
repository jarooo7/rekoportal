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
import { SubModel, GroupModel } from '../../../group/models/group';

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
  view = false;
  collapse: string;
  howSub = 0;
  sub: SubModel[];
  invit: UserId[] = [];
  isAdmin: boolean;
  invitFlag = false;
  subFlag = false;
  avatar: AvatarModel;
  uid: string;
  user: Observable<firebase.User>;
  result: UserModel[] = [];
  gResult: GroupModel[] = [];
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
          this.isSub(u.uid);
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
    this.collapse = 'nodisplay';
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

  subOpen() {
    this.subFlag = !this.subFlag;
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

  isSubs(): string {
      if (this.howSub === 0) {
        return 'true';
      }
      return 'false';
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
    this.router.navigate(['/group/posts']));
  }
  search() {
    this.view = false;
    const text: string = this.searchForm.get(FormControlNames.SEARCH).value;
    this.router.navigate([`search/result-search/${getFormatedSearch(text.toLocaleLowerCase())}`]);
  }

  goToMyProfile() {
    this.router.navigate([`user/profile/${this.uid}`]);
  }

  toggle() {
    if (this.collapse === 'nodisplay') {
      this.collapse = 'display';
    } else {
      this.collapse = 'nodisplay';
    }
  }

  goToAdmin() {
    this.router.navigate(['/admin/admin-panel']);
  }

  searchNow(event) {
    const textSearch = getFormatedSearch(event.toLocaleLowerCase());
    if (textSearch.length < 3) {
      this.result = [];
      return;
    }
    this.view = true;
    this.searchService.get3User(textSearch, textSearch + '\uf8ff')
      .pipe(
        map(like =>
          like.map(l => ({ key: l.payload.key, ...l.payload.val() }))
        ))
      .subscribe(u => {
        this.result = u;
      });
      this.searchService.get3Group(textSearch, textSearch + '\uf8ff')
      .pipe(
        map(like =>
          like.map(l => ({ key: l.payload.key, ...l.payload.val() }))
        ))
      .subscribe(u => {
        this.gResult = u;
      });
  }

  hidesearch() {
    this.view = false;
  }

  isSub(userId: string) {
    this.userService.isSub(userId).pipe(
      map(sug =>
      sug.map(u => ({ key: u.payload.doc.id, ...u.payload.doc.data() }))))
      .subscribe(p => {
        this.sub = p.reverse();
        this.howSub = 0;
        p.forEach(u => {
          if (!u.read) {
            this.howSub++;
          }
        });
      });
      }

}
