export class Notascli {
    notascliId: number = 0;
    nrodcto: string | null = null;
    fechanota: Date = new Date();
    fechavence: Date | null = null;
    clienteId: number = 0;
    tipo: string = '';
    cufe: string | null = null;
    vrExcluido: number = 0.0;
    vrGravado: number = 0.0;
    iva: number = 0.0;
    retefuente: number = 0.0;
    reteiva: number = 0.0;
    reteica: number = 0.0;
    vrTotal: number = 0.0;
    saldo: number = 0.0;
    useridConfirma: number | null = null;
    observa: string | null = null;
    conceptonotacliId: number = 0;
    recibo: string | null = null;
    anulado: number | null = null;
    observaanula: string | null = null;
    dctoElectronico: number = 0;
    factura: string | null = null;
  
    constructor(data: Partial<Notascli> = {}) {
      Object.assign(this, data);
    }
  }
  