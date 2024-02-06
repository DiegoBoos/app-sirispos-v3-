import { PagoscliTransac } from "./pagocli-transac.model";

export class PagoCli {
    pagocliId: number = 0;
    clienteId: number = 0;
    fecha?: Date = new Date();
    tipo: string = '';
    nrodcto?: string | null = null;
    valor: number = 0.0;
    useridConfirma?: number | null = null;
    observacion?: string | null = null;
    formaPago?: string | null = null;
    cheque?: string | null = null;
    ach?: string | null = null;
    recibo?: string | null = null;
    vrRecibo: number = 0.0;
    anulado: number = 0;
    observaanula?: string | null = null;
    pagosCliTransac?: PagoscliTransac[] = [];
  
    constructor(data: Partial<PagoCli> = {}) {
      Object.assign(this, data);
    }
  }
  