import { Tercero } from "./tercero.model";

export class Cliente {
    clienteId?: number;
    codigo: string = '';
    terceroId: number = 0;
    tipoPrecioId: number = 0;
    vendedorId: number = 0;
    zonaId: number = 0;
    actividadeconomicaId?: number;
    nombreComercial?: string = '';
    direccion1?: string = '';
    direccion2?: string = '';
    direccion3?: string = '';
    email?: string = '';
    telefono?: string = '';
    celular?: string = '';
    cumpleanios?: string = '';
    fechaCreacion: Date = new Date();
    cupoCredito: number = 0;
    ultimaVenta?: Date;
    contactoCliente?: string = '';
    ultimaDevolucion?: Date;
    ventaAcumulaAnio?: number;
    ventaAcumulaMes?: number;
    activo: number = 0;
    plazoCredito: number = 0;
    latitud?: number;
    longitud?: number;
    aplicaFe: number = 0;
    nombreContacto1?: string = '';
    cargo1?: string = '';
    emailReceptor1?: string = '';
    telefonoContacto1?: string = '';
    nombreContacto2?: string = '';
    cargo2?: string = '';
    emailReceptor2?: string = '';
    telefonoContacto2?: string = '';
    municipioId: number = 0;
    diasBloqueoMora: number = 0;
    tercero?: Tercero;
  
    constructor(data: Partial<Cliente> = {}) {
      Object.assign(this, data);
    }
  }