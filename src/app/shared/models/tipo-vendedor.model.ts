export class TipoVendedor {
    tipovendedorId?: number = 0;
    codigo: string = '';
    descripcion: string = '';
  
    constructor(data: Partial<TipoVendedor> = {}) {
      Object.assign(this, data);
    }
  }