import { Cliente } from "../../customers/models/cliente-model";
import { Pedido } from "../../pedidos/interfaces/pedido.interface";

export class InvoiceEvent {
  
    id?: string;
    pedidoId?: number;
    invoiceNumber?: string;
    cliente?: Cliente;
    pedido?: Pedido;
  
    constructor(data: Partial<InvoiceEvent> = {}) {
      Object.assign(this, data);
    }
  }