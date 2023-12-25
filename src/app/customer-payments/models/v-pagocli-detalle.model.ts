export class VPagoCliDetalle {
  pagoclitransac_id: number = 0;
  pagocli_id: number = 0;
  tipo_dcto: string = '';
  subtotal: number = 0;
  descuento: number = 0;
  vr_pago: number = 0;
  descdcto: number = 0;
  dcto: number = 0;
  nrofactura: string = '';
  fechadcto: Date = new Date();
  estado: number = 0;
  valor: number = 0;
  saldo: number = 0;
  iva: number = 0;
  retefuente: number = 0;
  reteiva: number = 0;
  reteica: number = 0;
  transaccli_id: number = 0;
  tipotransac: string = '';
  fechapago: Date = new Date();
  tipopago: string = '';
  nrodcto: string = '';
  forma_pago: string = '';
  tipo_doc_cli: string = '';
  identificacion: string = '';
  nombre_comercial: string = '';
  cliente_id: number = 0;
  vr_recibo: number = 0;
  vr_dcto: number = 0;
  vendedor: string = '';
  termino_pago: string = '';
  recibo: string = '';
  isSelected?: boolean = false;

  constructor(data: Partial<VPagoCliDetalle> = {}) {
    Object.assign(this, data);
  }
}
