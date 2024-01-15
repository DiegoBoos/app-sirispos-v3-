export class ResponsabilidadFiscal {
    paisId?: number = 0;
    codigo: string = '';
    descripcion: string = '';
  
    constructor(data: Partial<ResponsabilidadFiscal> = {}) {
      Object.assign(this, data);
    }
  }