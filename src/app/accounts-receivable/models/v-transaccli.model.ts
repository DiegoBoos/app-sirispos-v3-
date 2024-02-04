export class VTransacCli {
    transaccli_id: number = 0;
    tipodcto: string = '';
    descdcto: string = '';
    dcto: string = '';
    nrofactura: string = '';
    fechadcto: Date = new Date();
    fechavence: Date = new Date();
    tipo_doc: string = '';
    identificacion: string = '';
    nombre_comercial: string = '';
    codigo_persona: Date = new Date();
    persona: string = '';
    codigo_regimen: string = '';
    regimen: string = '';
    estado: string = '';
    cliente_id: number = 0;
    valor: number = 0;
    saldo: number = 0;
    iva: number = 0;
    retefuente: number = 0;
    reteiva: number = 0;
    reteica: number = 0;
    descuento: number = 0;
    diasVence: number = 0;
    proximo_vencer: string = '';
    vencida: string = '';
    diasbloqueomora: number = 0;
    concepto_id: number = 0;
    anulado: number = 0;
    clientevendedor_id: number = 0;
    vendedorcliente: string = '';
    termino_pago: number = 0;
    isSelected?: boolean;
    diasFactura?: number = 0;
    descuentoPago?: number = 0;
    vrPago?: number = 0;
  
    constructor(data: Partial<VTransacCli> = {}) {
      Object.assign(this, data);
    }
  }
  