export class VCliente {
    cliente_id: number = 0;
    identificacion: string = '';
    tipo_doc: string = '';
    display: string = '';
    codigo_persona: number = 0;
    persona: string = '';
    codigo_regimen: number = 0;
    regimen: string = '';
    nombre_comercial: string = '';
    codigo_cliente: string = '';
    contacto_cliente: string = '';
    direccion1: string = '';
    direccion2: string = '';
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
    base: number = 0;
    tarifa: number = 0;
    vendedor_id: number = 0;
    vendedor: string = '';
    tipoprecio_id: number = 0;
    tipo_precio: string = '';
    codpostal: string = '';
    nombre: string = '';
    departamento: string = '';
    municipio: string = '';
    codigo_departamento: string = '';
    codigo_municipio: string = '';
    codigo_pais: string = '';
    pais: string = '';
    digito_verificacion: string = '';
    precio_anulado: boolean = false;
    codigo_documento: string = '';
    municipio_cliente: string = '';
    diasbloqueomora: number = 0;
    dctoivaobsequio: boolean = false;
    zona_id: number = 0;
    zona: string = '';
    responsabilidades_fiscales: string = '';
  
    constructor(data: Partial<VCliente> = {}) {
      Object.assign(this, data);
    }
  }
  