import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsNotAuthGuard } from './guard/is-not-auth.guard';
import { IsNotVerificationGuard } from './guard/is-not-verification.guard';
import { IsVerificationGuard } from './guard/is-verification.guard';

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
    path: 'table-post',
    loadChildren: './../table-post/table-post.module#TablePostModule',
    canActivate: [IsVerificationGuard]
  },
  {
    path: 'email-action',
    loadChildren: './../email-action/email-action.module#EmailActionModule'
  },
  {
    path: 'user',
    loadChildren: './../user/user.module#UserModule',
    canActivate: [IsVerificationGuard]
  },
  {
    path: 'group',
    loadChildren: './../group/group.module#GroupModule'
  },
  {
    path: 'admin',
    loadChildren: './../admin/admin.module#AdminModule',
    canActivate: [IsVerificationGuard]
  },
  {
    path: 'search',
    loadChildren: './../search/search.module#SearchModule',
    canActivate: [IsVerificationGuard]
  },
  {
    path: '',
    redirectTo: 'group',
    pathMatch: 'full'
  },
  {
    path: '*',
    redirectTo: 'group',
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
