import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../../shared/services/alert.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-not-active',
  templateUrl: './not-active.component.html',
  styleUrls: ['./not-active.component.scss']
})
export class NotActiveComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private alert: AlertService
  ) { }

  ngOnInit() {
  }
  sendEmail() {
    this.authService.sendActiveEmail()
    .then(() => {
      this.translate
      .get('alert.success.sendActiveEmail')
      .pipe(takeUntil(this.destroy$))
      .subscribe(translation => {
        this.alert.showNotification('success', translation);
      });
    })
    .catch( () => {
      this.translate
      .get('alert.success.errorSendActiveEmail')
      .pipe(takeUntil(this.destroy$))
      .subscribe(translation => {
        this.alert.showNotification('success', translation);
      });

    });
  }
}
