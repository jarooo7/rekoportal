import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
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
