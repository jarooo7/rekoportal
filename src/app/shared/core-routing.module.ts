import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
// import {LogoutGuard} from './guards/logout.guard';
// import {LoggedInGuard} from './guards/logged-in.guard';

const routes: Routes = [
  // {
  //   path: 'auth',
  //   loadChildren: './../auth/auth.module#AuthModule',
  //   canActivate: [LogoutGuard]
  // },
  // {
  //   path: 'reports',
  //   loadChildren: './../reports/reports.module#ReportsModule',
  //   canActivate: [LoggedInGuard]
  // },
  // {
  //   path: 'user',
  //   loadChildren: './../user/user.module#UserModule',
  //   canActivate: [LoggedInGuard]
  // },
  // {
  //   path: '',
  //   redirectTo: 'reports',
  //   pathMatch: 'full'
  // },
  // {
  //   path: '**',
  //   redirectTo: 'auth',
  //   pathMatch: 'full'
  // }
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
