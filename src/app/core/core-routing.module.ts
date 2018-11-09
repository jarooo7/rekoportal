import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotAuthGuard } from './guard/not-auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: './../auth/auth.module#AuthModule',
    canActivate: [NotAuthGuard]
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class CoreRoutingModule { }
