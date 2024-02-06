export class VTransacCli {
    transaccliId: number = 0;
    tipodcto: string = '';
    descdcto: string = '';
    dcto: string = '';
    nrofactura: string = '';
    fechadcto: Date = new Date();
    fechavence: Date = new Date();
    tipoDoc: string = '';
    identificacion: string = '';
    nombreComercial: string = '';
    codigoPersona: Date = new Date();
    persona: string = '';
    codigoRegimen: string = '';
    regimen: string = '';
    estado: string = '';
    clienteId: number = 0;
    valor: number = 0;
    saldo: number = 0;
    iva: number = 0;
    retefuente: number = 0;
    reteiva: number = 0;
    reteica: number = 0;
    descuento: number = 0;
    diasVence: number = 0;
    proximoVencer: string = '';
    vencida: string = '';
    diasbloqueomora: number = 0;
    conceptoId: number = 0;
    anulado: number = 0;
    clientevendedorId: number = 0;
    vendedorcliente: string = '';
    terminoPago: number = 0;
    isSelected?: boolean;
    diasFactura?: number = 0;
    descuentoPago?: number = 0;
    vrPago?: number = 0;
  
    constructor(data: Partial<VTransacCli> = {}) {
      Object.assign(this, data);
    }
  }
  