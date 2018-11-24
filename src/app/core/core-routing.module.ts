import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsNotAuthGuard } from './guard/is-not-auth.guard';
import { IsNotVerificationGuard } from './guard/is-not-verification.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: './../auth/auth.module#AuthModule',
    canActivate: [IsNotAuthGuard]
  },
  {
    path: 'not-active-user',
    loadChildren: './../not-active/not-active.module#NotActiveModule',
    canActivate: [IsNotVerificationGuard]
  },
  {
    path: 'email-action',
    loadChildren: './../email-action/email-action.module#EmailActionModule'
  },
  {
    path: 'user',
    loadChildren: './../user/user.module#UserModule'
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
