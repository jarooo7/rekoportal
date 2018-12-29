import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AuthService } from '../../auth/services/auth.service';
import { SugGroupModel } from '../models/suggestionGroup';

@Injectable({
  providedIn: 'root'
})
export class GropuService {

  userId: string;

  constructor(
    private dataBase: AngularFireDatabase,
    private authService: AuthService) {
      this.authService.authState$.subscribe(user => {
        if (user) {
          this.userId = user.uid;
        }
      });
    }

    addSuggestionGroup(sug: SugGroupModel) {
      const gr: AngularFireList<SugGroupModel> = this.dataBase.list('sugGroup');
      return gr.push(sug);
    }
}
