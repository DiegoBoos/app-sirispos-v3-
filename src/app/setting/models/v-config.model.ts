export class VConfig {
  tercero_id: number = 0;
  codigo_alterno: string = '';
  codigo_documento: string = '';
  tipo_documento: string = '';
  identificacion: string = '';
  digito_verificacion: string = '';
  apellido1: string = '';
  apellido2: string = '';
  nombre1: string = '';
  nombre2: string = '';
  razon_social1: string = '';
  razon_social2: string = '';
  direccion1: string = '';
  direccion2: string = '';
  codigo_regimen: string = '';
  regimen: string = '';
  codigo_persona: string = '';
  persona: string = '';
  nombre_comercial: string = '';
  codigo_cliente: string = '';
  contacto_cliente: string = '';
  direccion3: string = '';
  telefono: string = '';
  celular: string = '';
  email: string = '';
  activo: boolean = false;
  aplica_fe: boolean = false;
  plazo_credito: number = 0;
  cupo_credito: number = 0;
  reteiva: boolean = false;
  retefuente: boolean = false;
  reteica: boolean = false;
  porcreteica: number = 0;
  tipoprecio_id: number = 0;
  tipo_precio: string = '';
  responsabilidades_fiscales: string = '';
  moneda_id: number = 0;
  simbolo_moneda: string = '';
  moneda: string = '';
  config_id: number = 0;
  centro_costo: string = '';
  subcentro_costo: string = '';
  logo: string = '';
  piefactura: string = '';
  consec_orden_pedido: number = 0;
  consec_mov_ent: number = 0;
  consec_mov_sal: number = 0;
  recibo_pago: string = '';
  consec_recibo_pago: number = 0;
  autoretenedor: boolean = false;
  verimagen: boolean = false;
  consec_recepcion: number = 0;
  precioinciva: boolean = false;
  coditemauto: string = '';
  consec_coditem: number = 0;
  round_pventa_cen: boolean = false;
  tipo_round_cen: string = '';
  tipo_round_mil: string = '';
  valor_round_mil: number = 0;
  round_pventa_mil: boolean = false;
  factor_adicional_fraccion: boolean = false;
  porcreteiva: number = 0;
  pedir_cant_venta: boolean = false;
  modelo: string = '';
  veritem_sinstock: boolean = false;
  pt_empresa: string = '';
  pt_cuenta: string = '';
  pt_password: string = '';
  codcliauto: string = '';
  consec_codcli: number = 0;
  codprvauto: string = '';
  consec_codprv: number = 0;
  printcopia: boolean = false;
  talonario_pago: boolean = false;
  pedir_lote: boolean = false;
  lim_pedir_cantidad: number = 0;
  caja_id: number = 0;
  factura_directa: boolean = false;
  onfe: boolean = false;
  feticket: boolean = false;
  modelo_orden: string = '';
  precio_automatico: boolean = false;
  tipo_documento_codigo: string = '';
  integrador_fe: boolean = false;
  user_taxa: string = '';
  pass_taxa: string = '';
  endpoint_taxxa: string = '';
  posonline: boolean = false;
  manejabodega: boolean = false;
  integrador_ds: boolean = false;
  user_taxa_ds: string = '';
  pass_taxa_ds: string = '';
  endpoint_taxxa_ds: string = '';
  pt_empresa_ds: string = '';
  pt_cuenta_ds: string = '';
  pt_password_ds: string = '';
  uvt: number = 0;
  municipio: string = '';
  departamento: string = '';
  pais: string = '';
  codigo_municipio: string = '';
  codigo_departamento: string = '';
  codigo_pais: string = '';
  codpostal: string = '';
  nombre_tercero: string = '';
  

  
  constructor(data: Partial<VConfig> = {}) {
    Object.assign(this, data);
  }
}
