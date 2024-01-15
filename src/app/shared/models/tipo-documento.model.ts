export class TipoDocumento {
    tipodocumentoId?: number = 0;
    codigo: string = '';
    nombre: string = '';
    codigoAlterno: string = '';
    
  
    constructor(data: Partial<TipoDocumento> = {}) {
      Object.assign(this, data);
    }
  }