export class Pais {
    paisId?: number = 0;
    codigo: string = '';
    nombre: string = '';
  
    constructor(data: Partial<Pais> = {}) {
      Object.assign(this, data);
    }
  }