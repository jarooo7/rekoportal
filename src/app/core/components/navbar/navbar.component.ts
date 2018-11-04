import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  language: string;
  countryFlag: string;
  languageDropdown = 'dropdown-close';
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
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loadLanguage();
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
    this.buttonLanguage();
  }

  buttonLanguage() {
    if (this.languageDropdown === 'dropdown-close') {
      this.languageDropdown = 'dropdown-open';
    } else {
      this.languageDropdown = 'dropdown-close';
    }
  }


}
