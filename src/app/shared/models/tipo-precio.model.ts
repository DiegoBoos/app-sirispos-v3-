export class TipoPrecio {
    tipoprecioId?: number = 0;
    descripcion: string = '';
    factorPrecio: number = 0;
    anulado: number = 0;
    
  
    constructor(data: Partial<TipoPrecio> = {}) {
      Object.assign(this, data);
    }
  }