export class VPagoCli {
  pagocli_id: number = 0;
  tipo: string = '';
  desc_tipo: string = '';
  dcto: string = '';
  fecha: Date = new Date();
  cliente_id: number = 0;
  tipo_doc: string = '';
  identificacion: string = '';
  nombre_comercial: string = '';
  codigo_persona: Date = new Date();
  persona: string = '';
  codigo_regimen: string = '';
  regimen: string = '';
  email: string = '';
  valor: string = '';
  userid_confirma: number = 0;
  observacion: string = '';
  forma_pago: string = '';
  cheque: string = '';
  ach: string = '';
  recibo: string = '';
  vr_recibo: number = 0;
  anulado: number = 0;
  observaanula: string = '';
  

  constructor(data: Partial<VPagoCli> = {}) {
    Object.assign(this, data);
  }
}
