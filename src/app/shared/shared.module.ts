import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule
];

const DIRECTIVES = [

];

const COMPONENTS = [

];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...DIRECTIVES,
    ...COMPONENTS
  ],
  exports: [
    ...MODULES,
    ...DIRECTIVES,
    ...COMPONENTS
  ]
})
export class SharedModule { }
