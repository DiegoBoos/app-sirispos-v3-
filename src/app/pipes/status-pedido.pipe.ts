

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statuspedido' })
export class StatusPedidoPipe implements PipeTransform {

  transform(statusCode: string): string {
    switch (statusCode) {
      case 'A': {
        return 'Anulado';
      }
      case 'F': {
        return 'Facturado';
      }
      case 'N': {
        return 'Facturando';
      }
      case 'P': {
        return 'Pendiente';
      }
      case 'V': {
        return 'Verificación';
      }
      case 'E': {
        return 'Elaboración';
      }
      case 'Z': {
        return 'Finalizado';
      }
      default: {
        return 'Con error';
      }
    }
  }
}
