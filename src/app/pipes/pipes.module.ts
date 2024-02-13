import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionPipe } from './action.pipe';
import { StatusCodePipe } from './status-code.pipe';
import { InvoiceTypePipe } from './invoice-type.pipe';
import { StatusPedidoPipe } from './status-pedido.pipe copy';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ActionPipe,
    StatusCodePipe,
    InvoiceTypePipe,
    StatusPedidoPipe

  ],
  exports: [
    ActionPipe,
    StatusCodePipe,
    InvoiceTypePipe,
    StatusPedidoPipe,
  ]
})
export class PipesModule { }
