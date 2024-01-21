import { TipoVendedor } from "./tipo-vendedor.model";

export class Vendedor {
    vendedorId?: number = 0;
    tipoVendedor?: TipoVendedor;
    nombre: string = '';
    celular: string = '';
    porcComision?: number = 0;
    cuotaVentas?: number = 0;
    fechaCreacion?: Date;
    
  
    constructor(data: Partial<Vendedor> = {}) {
      Object.assign(this, data);
    }
  }