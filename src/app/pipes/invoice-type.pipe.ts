

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'invoicetype' })
export class InvoiceTypePipe implements PipeTransform {

  transform(invoiceType: string): string {
    switch (invoiceType) {
      case 'O1': {
        return 'FA'; // Factura electrónica de Venta
      }
      case 'O5': {
        return 'DS'; // Documento Soporte en adquisiciones a No Obligados a Facturar
      }
      case '91': {
        return 'NC'; // Nota Crédito
      }
      case '92': {
        return 'ND'; // Nota Débito
      }
      case '95': {
        return 'NS'; // Nota de Ajuste Documento Documento Soporte en adquisiciones a No Obligados a Facturar
      }
      default: {
        return invoiceType;
      }
    }
  }
}
