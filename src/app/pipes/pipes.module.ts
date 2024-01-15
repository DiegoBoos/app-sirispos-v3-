import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionPipe } from './action.pipe';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ActionPipe,


  ],
  exports: [
    ActionPipe,

  ]
})
export class PipesModule { }
