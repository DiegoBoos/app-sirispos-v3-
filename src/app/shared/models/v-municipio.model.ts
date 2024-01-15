export class VMunicipio {
    municipioId?: number = 0;
    codigo: string = '';
    nombre: string = '';
  
    constructor(data: Partial<VMunicipio> = {}) {
      Object.assign(this, data);
    }
  }