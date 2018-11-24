import { Injectable } from '@angular/core';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { AngularFireStorage } from 'angularfire2/storage';
import { AuthService } from '../../auth/services/auth.service';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { PostModel } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  post: AngularFireObject<PostModel> = null;


  constructor(
    private ng2ImgToolsService: Ng2ImgToolsService,
    private dataBase: AngularFireDatabase,
    private authService: AuthService,
    private afStorage: AngularFireStorage
  ) {
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.post = dataBase.object(`post/${user.uid}`);
      }
    });
  }

  resize(file: File[]) {
    this.ng2ImgToolsService.resize(file, 960, 960, false);
  }


}
