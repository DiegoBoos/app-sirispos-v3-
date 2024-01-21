import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionPipe } from './action.pipe';
import { StatusCodePipe } from './status-code.pipe';
import { InvoiceTypePipe } from './invoice-type.pipe';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ActionPipe,
    StatusCodePipe,
    InvoiceTypePipe,

  ],
  exports: [
    ActionPipe,
    StatusCodePipe,
    InvoiceTypePipe,
  ]
})
export class PipesModule { }
